import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {createNovel, updateNovel} from "../../features/novelwriters/api.ts";
import type {NovelDto} from "../../features/novels/type.ts";
import {getNovel} from "../../features/novels/api.ts";
import {uploadFile} from "../api/image.api.ts";
import {bytesToBase64} from "../helper.ts";
import {ImageUploader} from "./ImageUploader.tsx";

const ROMANCE_TYPES = ["None", "Hetero", "Yuri", "Yaoi", "Mixed"];
const WORK_TYPES = ["Original", "Fanfiction"];
const STATUSES = ["Publishing", "Complete", "Hiatus", "Abandoned"];
const GENRES = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Harem",
    "Romance",
    "SliceOfLife",
    "Supernatural",
    "School",
    "SciFi",
    "Mystery",
    "Horror",
    "Psychological",
    "Isekai",
    "MartialArts",
];

const GENRE_LABELS: Record<string, string> = {
    SliceOfLife: "Slice of Life",
    SciFi: "Sci-Fi",
    MartialArts: "Martial Arts",
};

type EditorMode = "create" | "update";

interface NovelEditorProps {
    mode: EditorMode;
    novelId?: string;
}

interface NovelFormData {
    title: string;
    description: string;
    romanceType: string;
    workType: string;
    status: string;
}

interface SelectedCover {
    file: File;
    bytes: Uint8Array;
}

const EMPTY_FORM: NovelFormData = {
    title: "",
    description: "",
    romanceType: "None",
    workType: "Original",
    status: "Publishing",
};

export default function NovelEditor({mode, novelId}: NovelEditorProps) {
    const isUpdate = mode === "update";
    const navigate = useNavigate();
    const [formData, setFormData] = useState<NovelFormData>(EMPTY_FORM);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedCover, setSelectedCover] = useState<SelectedCover | null>(null);
    const [coverRemoved, setCoverRemoved] = useState(false);
    const [loadedNovel, setLoadedNovel] = useState<NovelDto | null>(null);
    const [isLoading, setIsLoading] = useState(isUpdate);

    useEffect(() => {
        let ignoreResult = false;

        if (!isUpdate) {
            setFormData(EMPTY_FORM);
            setSelectedGenres([]);
            setSelectedCover(null);
            setCoverRemoved(false);
            setLoadedNovel(null);
            setIsLoading(false);
            return () => {
                ignoreResult = true;
            };
        }

        if (!novelId) {
            toast.error("Novel id is missing.");
            navigate("/create", {replace: true});
            return () => {
                ignoreResult = true;
            };
        }

        setIsLoading(true);

        async function loadNovel() {
            try {
                const novel = await getNovel(novelId!);

                if (ignoreResult) return;

                setLoadedNovel(novel);
                setFormData({
                    title: novel.title,
                    description: novel.description,
                    romanceType: novel.romanceType,
                    workType: novel.workType,
                    status: novel.status,
                });
                setSelectedGenres(novel.genres);
                setSelectedCover(null);
                setCoverRemoved(false);
            } catch (error) {
                if (ignoreResult) return;
                console.error(error);
                toast.error("Failed to load novel.");
                navigate("/create", {replace: true});
            } finally {
                if (!ignoreResult) setIsLoading(false);
            }
        }

        void loadNovel();

        return () => {
            ignoreResult = true;
        };
    }, [isUpdate, navigate, novelId]);

    const validate = () => {
        if (!formData.title.trim()) {
            toast.error("Title is required.");
            return false;
        }
        if (!formData.description.trim()) {
            toast.error("Description is required.");
            return false;
        }
        if (selectedGenres.length === 0) {
            toast.error("Select at least one genre.");
            return false;
        }
        return true;
    };

    const uploadCover = async (id: string) => {
        if (!selectedCover) return undefined;

        return uploadFile({
            Id: id,
            imageType: "Cover",
            data: bytesToBase64(selectedCover.bytes),
        });
    };

    const create = async () => {
        const novel = await createNovel({
            name: formData.title.trim(),
            description: formData.description.trim(),
            romanceType: formData.romanceType,
            genres: selectedGenres,
            workType: formData.workType,
        });

        if (selectedCover) {
            try {
                const coverUrl = await uploadCover(novel.id);
                await updateNovel({novelId: novel.id, coverUrl});
            } catch (error) {
                console.error(error);
                toast.warning("Novel was created, but its cover could not be uploaded.");
            }
        }

        toast.success("Novel created successfully.");
        navigate("/create");
    };

    const update = async () => {
        if (!novelId) return;

        let coverUrl: string | undefined;
        if (selectedCover) {
            try {
                coverUrl = await uploadCover(novelId);
            } catch (error) {
                console.error(error);
                toast.warning("Novel details were saved, but its cover could not be uploaded.");
            }
        }

        await updateNovel({
            novelId,
            name: formData.title.trim(),
            description: formData.description.trim(),
            coverUrl,
            removeCover: coverRemoved,
            genres: selectedGenres,
            workType: formData.workType,
            romanceType: formData.romanceType,
            status: formData.status,
        });

        toast.success("Novel updated successfully.");
        navigate("/create");
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            if (isUpdate) {
                await update();
            } else {
                await create();
            }
        } catch (error) {
            console.error(error);
            toast.error(isUpdate ? "Novel update failed." : "Novel creation failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            component="section"
            aria-labelledby="novel-details-heading"
            sx={{
                p: {xs: 2, sm: 3},
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
            }}
        >
            <Box sx={{mb: 3, maxWidth: 620}}>
                <Typography id="novel-details-heading" variant="h5" component="h1" gutterBottom>
                    {isUpdate ? "Edit your story" : "Tell readers about your story"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Add a memorable cover and the essential details readers will see first.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {xs: "minmax(0, 1fr)", md: "240px minmax(0, 1fr)"},
                    alignItems: "start",
                    gap: {xs: 3, md: 4},
                }}
            >
                <ImageUploader
                    initialImageUrl={coverRemoved ? undefined : loadedNovel?.coverUrl ?? undefined}
                    disabled={isLoading}
                    onFileReady={(bytes, file) => {
                        setSelectedCover({file, bytes});
                        setCoverRemoved(false);
                    }}
                    onRemove={() => {
                        setSelectedCover(null);
                        setCoverRemoved(isUpdate);
                    }}
                />

                <Stack spacing={2.5} sx={{minWidth: 0}}>
                    <TextField
                        value={formData.title}
                        id="Title"
                        label="Title"
                        fullWidth
                        disabled={isLoading}
                        onChange={(event) =>
                            setFormData((current) => ({...current, title: event.target.value}))}
                    />
                    <Autocomplete
                        disabled={isLoading}
                        disablePortal
                        options={WORK_TYPES}
                        value={formData.workType}
                        sx={{flex: 1, maxWidth: {xs: "none", md: 360}}}
                        renderInput={(params) => <TextField {...params} label="Work type" />}
                        onChange={(_, value) =>
                            setFormData((current) => ({...current, workType: value ?? "Original"}))}
                    />
                    {isUpdate && (
                        <Autocomplete
                            disabled={isLoading}
                            disablePortal
                            options={STATUSES}
                            value={formData.status}
                            sx={{flex: 1, maxWidth: {xs: "none", md: 360}}}
                            renderInput={(params) => <TextField {...params} label="Status" />}
                            onChange={(_, value) =>
                                setFormData((current) => ({...current, status: value ?? "Publishing"}))}
                        />
                    )}
                    {formData.workType === "Fanfiction" && (
                        <TextField
                            id="Fandom"
                            label="Fandom"
                            fullWidth
                            disabled
                            helperText="Fandom support is coming soon."
                        />
                    )}
                    <TextField
                        disabled={isLoading}
                        value={formData.description}
                        id="Description"
                        label="Description"
                        multiline
                        minRows={5}
                        maxRows={10}
                        fullWidth
                        onChange={(event) =>
                            setFormData((current) => ({...current, description: event.target.value}))}
                    />

                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <Autocomplete
                            disabled={isLoading}
                            disablePortal
                            options={ROMANCE_TYPES}
                            value={formData.romanceType}
                            sx={{flex: 1, maxWidth: {xs: "none", md: 360}}}
                            renderInput={(params) => <TextField {...params} label="Romance type" />}
                            onChange={(_, value) =>
                                setFormData((current) => ({...current, romanceType: value ?? "None"}))}
                        />
                        <Tooltip
                            title="Choose the primary romantic pairing readers should expect. Minor or secondary relationships may differ."
                            arrow
                        >
                            <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                    </Box>

                    <FormGroup
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr"},
                            gap: 1,
                        }}
                    >
                        {GENRES.map((genre) => (
                            <FormControlLabel
                                disabled={isLoading}
                                key={genre}
                                control={
                                    <Checkbox
                                        checked={selectedGenres.includes(genre)}
                                        onChange={(event) => {
                                            setSelectedGenres((current) =>
                                                event.target.checked
                                                    ? [...current, genre]
                                                    : current.filter((value) => value !== genre));
                                        }}
                                    />
                                }
                                label={GENRE_LABELS[genre] ?? genre}
                            />
                        ))}
                    </FormGroup>

                    <TextField
                        id="tags"
                        label="Tags"
                        fullWidth
                        disabled
                        helperText="Custom tags will be available in a future update."
                    />
                    <Button
                        disabled={isLoading}
                        sx={{alignSelf: "end"}}
                        variant="outlined"
                        onClick={() => void handleSubmit()}
                    >
                        {isLoading ? "Saving..." : isUpdate ? "Save changes" : "Create"}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
