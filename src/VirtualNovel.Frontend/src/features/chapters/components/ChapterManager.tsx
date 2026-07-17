import AddIcon from "@mui/icons-material/Add";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragCancelEvent,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {deleteChapter, reorderChapter} from "../api.ts";
import type {ChapterFeedDto, NovelDto} from "../../novels/type.ts";
import {useUserStore} from "../../../store/userStore.ts";
import SortableChapter from "./SortableChapter.tsx";

type ChapterOperation =
    | {type: "reorder"; chapterId: string; newOrder: number}
    | {type: "delete"; chapterId: string};

type ChapterManagerProps = {
    novel: NovelDto | null;
    novelId: string;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onRefresh: () => Promise<void>;
};

function normalizeChapters(chapters: ChapterFeedDto[]): ChapterFeedDto[] {
    return chapters.map((chapter, index) => ({...chapter, order: index + 1}));
}

export default function ChapterManager({
    novel,
    novelId,
    isLoading,
    error,
    onRetry,
    onRefresh,
}: ChapterManagerProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = useUserStore((state) => state.user);
    const [chapters, setChapters] = useState<ChapterFeedDto[]>([]);
    const [draftOrders, setDraftOrders] = useState<Record<string, string>>({});
    const [orderErrors, setOrderErrors] = useState<Record<string, boolean>>({});
    const [chapterToDelete, setChapterToDelete] = useState<ChapterFeedDto | null>(null);
    const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);
    const [pendingOperation, setPendingOperation] = useState<"reorder" | "delete" | null>(null);
    const mutationLockRef = useRef(false);

    useEffect(() => {
        const nextChapters = [...(novel?.chapters ?? [])].sort((a, b) => a.order - b.order);
        setChapters(nextChapters);
        setDraftOrders(Object.fromEntries(nextChapters.map((chapter) => [chapter.id, String(chapter.order)])));
        setOrderErrors({});
    }, [novel]);

    const mutation = useMutation({
        mutationFn: async (operation: ChapterOperation) => {
            if (operation.type === "reorder") {
                await reorderChapter({chapterId: operation.chapterId, newOrder: operation.newOrder});
            } else {
                await deleteChapter(operation.chapterId);
            }
        },
        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["novels"]}),
                queryClient.invalidateQueries({queryKey: ["author-novels"]}),
                queryClient.invalidateQueries({queryKey: ["novel", novelId]}),
            ]);
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(TouchSensor, {activationConstraint: {delay: 180, tolerance: 6}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
    );

    const canManage = Boolean(
        novel && currentUser?.firebaseUid && novel.author.authorId === currentUser.firebaseUid,
    );
    const isBusy = pendingOperation !== null || mutation.isPending;

    const moveChapter = async (chapterId: string, newOrder: number) => {
        if (mutationLockRef.current || isBusy) return;
        const previous = chapters;
        const oldIndex = previous.findIndex((chapter) => chapter.id === chapterId);
        const newIndex = newOrder - 1;
        if (oldIndex < 0 || oldIndex === newIndex) return;

        mutationLockRef.current = true;
        setPendingOperation("reorder");
        const optimistic = normalizeChapters(arrayMove(previous, oldIndex, newIndex));
        setChapters(optimistic);
        setDraftOrders(Object.fromEntries(optimistic.map((chapter) => [chapter.id, String(chapter.order)])));
        setOrderErrors({});

        try {
            await mutation.mutateAsync({type: "reorder", chapterId, newOrder});
            await onRefresh();
            toast.success("Chapter order updated.");
        } catch (mutationError) {
            console.error(mutationError);
            setChapters(previous);
            setDraftOrders(Object.fromEntries(previous.map((chapter) => [chapter.id, String(chapter.order)])));
            toast.error("Could not reorder the chapter. The original order was restored.");
            try {
                await onRefresh();
            } catch {
                // The rollback remains visible if the follow-up fetch is unavailable.
            }
        } finally {
            mutationLockRef.current = false;
            setPendingOperation(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveChapterId(null);
        setDropTargetId(null);
        if (!event.over || event.active.id === event.over.id) return;
        const targetIndex = chapters.findIndex((chapter) => chapter.id === event.over!.id);
        if (targetIndex >= 0) void moveChapter(String(event.active.id), targetIndex + 1);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveChapterId(String(event.active.id));
    };

    const handleDragOver = (event: DragOverEvent) => {
        setDropTargetId(event.over ? String(event.over.id) : null);
    };

    const handleDragCancel = (_event: DragCancelEvent) => {
        setActiveChapterId(null);
        setDropTargetId(null);
    };

    const commitManualOrder = (chapter: ChapterFeedDto) => {
        if (mutationLockRef.current || isBusy) return;
        const value = draftOrders[chapter.id] ?? "";
        const parsed = Number(value);
        const isValid = /^\d+$/.test(value) && Number.isInteger(parsed) && parsed >= 1 && parsed <= chapters.length;
        if (!isValid) {
            setOrderErrors((current) => ({...current, [chapter.id]: true}));
            return;
        }
        setOrderErrors((current) => ({...current, [chapter.id]: false}));
        if (parsed === chapter.order) return;
        void moveChapter(chapter.id, parsed);
    };

    const confirmDelete = async () => {
        if (!chapterToDelete || mutationLockRef.current || isBusy) return;
        mutationLockRef.current = true;
        setPendingOperation("delete");
        const previous = chapters;
        const next = normalizeChapters(previous.filter((chapter) => chapter.id !== chapterToDelete.id));
        setChapters(next);
        setChapterToDelete(null);

        try {
            await mutation.mutateAsync({type: "delete", chapterId: chapterToDelete.id});
            setDraftOrders(Object.fromEntries(next.map((chapter) => [chapter.id, String(chapter.order)])));
            await onRefresh();
            toast.success(`"${chapterToDelete.title}" deleted.`);
        } catch (mutationError) {
            console.error(mutationError);
            setChapters(previous);
            toast.error("Could not delete the chapter. Nothing was removed.");
            try {
                await onRefresh();
            } catch {
                // The rollback remains visible if the follow-up fetch is unavailable.
            }
        } finally {
            mutationLockRef.current = false;
            setPendingOperation(null);
        }
    };

    const addChapter = () => navigate(`/novel/${novelId}/chaptereditor/`);

    return (
        <Box
            component="section"
            aria-labelledby="chapters-heading"
            aria-busy={pendingOperation !== null}
            sx={{
                p: {xs: 2, sm: 3},
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
            }}
        >
            <Stack
                direction={{xs: "column", sm: "row"}}
                sx={{
                    alignItems: {xs: "stretch", sm: "flex-start"},
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 3,
                    pb: 2.5,
                    borderBottom: "2px solid",
                    borderColor: "text.primary",
                }}
            >
                <Box sx={{maxWidth: 640}}>
                    <Typography id="chapters-heading" variant="h5" component="h2" gutterBottom>
                        Chapters
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Drag chapters into place or enter an order number. Changes are saved immediately.
                    </Typography>
                </Box>
                {canManage && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addChapter}>
                        Add chapter
                    </Button>
                )}
            </Stack>

            {pendingOperation && (
                <Box role="status" aria-live="polite" sx={{mb: 2}}>
                    <LinearProgress color={pendingOperation === "delete" ? "error" : "primary"} />
                    <Typography variant="caption" color="text.secondary" sx={{display: "block", mt: 0.75}}>
                        {pendingOperation === "delete" ? "Deleting chapter and renumbering the list..." : "Saving the new chapter order..."}
                    </Typography>
                </Box>
            )}

            {isLoading && (
                <Stack spacing={1} aria-label="Loading chapters">
                    {[0, 1, 2].map((item) => <Skeleton key={item} variant="rounded" height={72} />)}
                </Stack>
            )}

            {!isLoading && error && (
                <Alert
                    severity="error"
                    action={<Button color="inherit" size="small" onClick={onRetry}>Try again</Button>}
                >
                    {error}
                </Alert>
            )}

            {!isLoading && !error && novel && !canManage && (
                <Alert severity="warning">Only this novel’s author can manage its chapters.</Alert>
            )}

            {!isLoading && !error && canManage && chapters.length === 0 && (
                <Box
                    sx={{py: {xs: 4, sm: 6}, px: 2, textAlign: "center", borderTop: "1px solid", borderColor: "divider"}}
                >
                    <Typography variant="h6" gutterBottom>Your story is ready for its first chapter</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2.5}}>
                        Add a chapter now. New chapters appear at the end of the list.
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={addChapter}>Add chapter</Button>
                </Box>
            )}

            {!isLoading && !error && canManage && chapters.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragCancel={handleDragCancel}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={chapters.map((chapter) => chapter.id)} strategy={verticalListSortingStrategy}>
                        <Box
                            component="ol"
                            aria-label="Chapter order"
                            sx={{m: 0, p: 0, listStyle: "none", border: "1px solid", borderColor: "divider", borderRadius: 1, overflow: "hidden"}}
                        >
                            {chapters.map((chapter) => (
                                <SortableChapter
                                    key={chapter.id}
                                    chapter={chapter}
                                    chapterCount={chapters.length}
                                    disabled={isBusy}
                                    draftOrder={draftOrders[chapter.id] ?? String(chapter.order)}
                                    orderError={Boolean(orderErrors[chapter.id])}
                                    isDropTarget={activeChapterId !== null && activeChapterId !== chapter.id && dropTargetId === chapter.id}
                                    onDraftChange={(value) => {
                                        setDraftOrders((current) => ({...current, [chapter.id]: value}));
                                        setOrderErrors((current) => ({...current, [chapter.id]: false}));
                                    }}
                                    onCommitOrder={() => commitManualOrder(chapter)}
                                    onEdit={() => navigate(`/novel/${novelId}/chaptereditor/${chapter.id}`)}
                                    onDelete={() => setChapterToDelete(chapter)}
                                />
                            ))}
                        </Box>
                    </SortableContext>
                </DndContext>
            )}

            <Dialog
                open={chapterToDelete !== null}
                onClose={isBusy ? undefined : () => setChapterToDelete(null)}
                fullWidth
                maxWidth="xs"
                aria-labelledby="delete-chapter-title"
            >
                <DialogTitle id="delete-chapter-title">Delete "{chapterToDelete?.title}"?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This cannot be undone. Remaining chapters will be renumbered automatically.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isBusy} onClick={() => setChapterToDelete(null)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        disabled={isBusy}
                        onClick={() => void confirmDelete()}
                    >
                        {isBusy ? "Deleting..." : "Delete chapter"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
