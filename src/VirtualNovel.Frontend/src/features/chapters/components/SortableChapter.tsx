import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Box, IconButton, Stack, TextField, Tooltip, Typography} from "@mui/material";
import {useRef} from "react";
import type {ChapterFeedDto} from "../../novels/type.ts";

export type SortableChapterProps = {
    chapter: ChapterFeedDto;
    chapterCount: number;
    disabled: boolean;
    draftOrder: string;
    orderError: boolean;
    isDropTarget: boolean;
    onDraftChange: (value: string) => void;
    onCommitOrder: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function SortableChapter({
    chapter,
    chapterCount,
    disabled,
    draftOrder,
    orderError,
    isDropTarget,
    onDraftChange,
    onCommitOrder,
    onEdit,
    onDelete,
}: SortableChapterProps) {
    const cancelBlurRef = useRef(false);
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging} =
        useSortable({id: chapter.id, disabled});

    const displayName = chapter.title?.trim() ? chapter.title : `Chapter ${chapter.order}`;

    return (
        <Box
            ref={setNodeRef}
            component="li"
            sx={{
                position: "relative",
                zIndex: isDragging ? 2 : 1,
                display: "grid",
                gridTemplateColumns: {
                    xs: "44px 60px minmax(0, 1fr) 88px",
                    sm: "44px 68px minmax(0, 1fr) 96px",
                },
                alignItems: "center",
                columnGap: {xs: 0.25, sm: 1.5},
                minHeight: 72,
                px: {xs: 0.25, sm: 1.5},
                py: 0.75,
                bgcolor: isDragging ? "action.selected" : "background.paper",
                borderBottom: "1px solid",
                borderColor: isDragging ? "primary.main" : "divider",
                outline: isDragging ? "3px solid" : "none",
                outlineColor: "primary.main",
                boxShadow: isDragging ? 6 : 0,
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: disabled && !isDragging ? 0.66 : 1,
                "&::before": isDropTarget ? {
                    content: '""',
                    position: "absolute",
                    top: -2,
                    left: 8,
                    right: 8,
                    height: 4,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    boxShadow: 2,
                } : undefined,
                "&:last-of-type": {borderBottom: 0},
            }}
        >
            <Tooltip title="Drag to reorder">
                <span>
                    <IconButton
                        ref={setActivatorNodeRef}
                        {...attributes}
                        {...listeners}
                        disabled={disabled}
                        aria-label={`Reorder ${displayName}`}
                        size="large"
                        sx={{
                            touchAction: "none",
                            cursor: disabled ? "default" : "grab",
                            "&.Mui-focusVisible": {
                                outline: "3px solid",
                                outlineColor: "primary.main",
                                outlineOffset: 2,
                            },
                        }}
                    >
                        <DragIndicatorIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <Box
                sx={{
                    alignSelf: "stretch",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: {xs: 0.25, sm: 0.5},
                }}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1}}
                >
                    NO.
                </Typography>
                <TextField
                    value={draftOrder}
                    disabled={disabled}
                    error={orderError}
                    size="small"
                    type="number"
                    inputMode="numeric"
                    aria-label={`Order for ${displayName}`}
                    slotProps={{htmlInput: {min: 1, max: chapterCount, step: 1}}}
                    sx={{
                        mt: 0.5,
                        width: "100%",
                        "& .MuiOutlinedInput-root": {borderRadius: 1},
                        "& .MuiInputBase-input": {
                            px: {xs: 0.75, sm: 1},
                            py: 0.75,
                            textAlign: "center",
                            fontWeight: 700,
                        },
                    }}
                    onChange={(event) => onDraftChange(event.target.value)}
                    onBlur={() => {
                        if (cancelBlurRef.current) {
                            cancelBlurRef.current = false;
                            return;
                        }
                        onCommitOrder();
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            event.currentTarget.blur();
                        }
                        if (event.key === "Escape") {
                            cancelBlurRef.current = true;
                            onDraftChange(String(chapter.order));
                            event.currentTarget.blur();
                        }
                    }}
                    variant="outlined"
                />
                {orderError && (
                    <Typography variant="caption" color="error">
                        1-{chapterCount}
                    </Typography>
                )}
            </Box>

            <Typography
                variant="body1"
                sx={{minWidth: 0, overflowWrap: "anywhere", lineHeight: 1.35, fontWeight: 600}}
            >
                {displayName}
            </Typography>

            <Stack direction="row" sx={{justifyContent: "flex-end", alignItems: "center", minWidth: 0}}>
                <Tooltip title="Edit chapter">
                    <span>
                        <IconButton
                            color="primary"
                            disabled={disabled}
                            aria-label={`Edit ${displayName}`}
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                                event.stopPropagation();
                                onEdit();
                            }}
                            size="medium"
                            sx={{
                                width: 44,
                                height: 44,
                                "&.Mui-focusVisible": {
                                    outline: "3px solid",
                                    outlineColor: "primary.main",
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Delete chapter">
                    <span>
                        <IconButton
                            color="error"
                            disabled={disabled}
                            aria-label={`Delete ${displayName}`}
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete();
                            }}
                            size="medium"
                            sx={{
                                width: 44,
                                height: 44,
                                "&.Mui-focusVisible": {
                                    outline: "3px solid",
                                    outlineColor: "error.main",
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Stack>
        </Box>
    );
}
