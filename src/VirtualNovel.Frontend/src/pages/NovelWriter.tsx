import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    Autocomplete,
    Box, Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useState} from "react";
import {ImageUploader} from "../shared/components/ImageUploader.tsx";
import {uploadFile} from "../shared/api/image.api.ts";
import {bytesToBase64} from "../shared/helper.ts";
import {toast} from "react-toastify";
import {createNovel, updateNovel} from "../features/novelwriters/api.ts";
import {useNavigate} from "react-router-dom";

const ROMANCE_TYPES = ["None", "Hetero", "Yuri", "Yaoi", "Mixed"];
const workType =["Original", "Fanfiction"]

export default function NovelWriter() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        romanceType: "",
        workType: "",
    });
    const[cover, setCover] = useState({
        cover: null as {file: File; bytes: Uint8Array} | null,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const genres = [
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
        "MartialArts"
    ];
    const genreLabels: Record<string, string> = {
        SliceOfLife: "Slice of Life",
        SciFi: "Sci-Fi",
        MartialArts: "Martial Arts",
    };
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const navigate = useNavigate();
    async function create() {
        const title = formData.title.trim();
        const description = formData.description.trim();

        if (!title) {
            toast.error("Title is required.");
            return;
        }

        if (!description) {
            toast.error("Description is required.");
            return;
        }

        if (selectedGenres.length === 0) {
            toast.error("Select at least one genre.");
            return;
        }

        setIsLoading(true);
        try {


            const novel = await createNovel({
                romanceType: formData.romanceType,
                genres: selectedGenres,
                name: title,
                workType: formData.workType,
                description: description
            })
            ///// create novel

            if (cover?.cover) {
                try {
                    const uploadCover = await uploadFile({
                        Id: novel.id,
                        imageType: "Cover",
                        data: bytesToBase64(cover.cover!.bytes)
                    });
                    await updateNovel({
                        novelId : novel.id,
                        coverUrl : uploadCover,
                        genres : selectedGenres,
                        workType: formData.workType,
                        romanceType: formData.romanceType
                    })
                } catch (error) {
                    console.log(error);
                    toast.warning("Novel Create but, Novel cover could not be uploaded.");
                }
                finally {
                    toast.success("Novel created successfully.");
                    navigate("/create")
                }
            }
        }catch (e) {
            console.error(e);
            toast.error("Novel creation failed.");
        } finally {
            setIsLoading(false);
            if(cover?.cover) {
                toast.success("Novel created successfully.");
            }
        }

    }
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
                    Tell readers about your story
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
                    onFileReady={(bytes, file) => {
                        setCover((current) => ({...current, cover: {file, bytes}}));
                    }}
                    onRemove={() => {
                        setCover((current) => ({...current, cover: null}));
                    }}
                />

                <Stack spacing={2.5} sx={{minWidth: 0}}>
                    <TextField id="Title" label="Title" variant="outlined" fullWidth onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={isLoading}/>
                    <Autocomplete
                        disabled={isLoading}
                        disablePortal
                        options={workType}
                        value={formData.workType || null}
                        sx={{flex: 1, maxWidth: {xs: "none", md: 360}}}
                        renderInput={(params) => <TextField {...params} label="Work type" />}
                        onChange={(_, value) => {
                            setFormData((current) => ({...current, workType: value ?? ""}));
                        }}
                    />
                    {formData.workType === "Fanfiction" && ( <TextField  id="Fandom" label="Fandom" variant="outlined" fullWidth disabled={true} helperText="Fandom support is coming soon."/>)}
                    <TextField
                        disabled={isLoading}
                        id="Description"
                        label="Description"
                        variant="outlined"
                        multiline
                        minRows={5}
                        maxRows={10}
                        fullWidth
                        onChange={(e) => setFormData((current) => ({...current, description: e.target.value }))}
                    />

                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <Autocomplete
                            disabled={isLoading}
                            disablePortal
                            options={ROMANCE_TYPES}
                            value={formData.romanceType || null}
                            sx={{flex: 1, maxWidth: {xs: "none", md: 360}}}
                            renderInput={(params) => <TextField {...params} label="Romance type" />}
                            onChange={(_, value) => {
                                setFormData((current) => ({...current, romanceType: value ?? ""}));
                            }}
                        />
                        <Tooltip
                            title="Choose the primary romantic pairing readers should expect.
Minor or secondary relationships may differ."
                            arrow
                        >
                            <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                    </Box>
                    <FormGroup
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "1fr 1fr 1fr",
                            },
                            gap: 1,
                        }}
                    >
                        {genres.map((genre) => (
                            <FormControlLabel
                                disabled={isLoading}
                                key={genre}
                                control={
                                    <Checkbox
                                        checked={selectedGenres.includes(genre)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedGenres([
                                                    ...selectedGenres,
                                                    genre,
                                                ])
                                            } else {
                                                setSelectedGenres(
                                                    selectedGenres.filter(
                                                        x => x !== genre
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                }
                                label={genreLabels[genre] ?? genre}
                            />
                        ))}
                    </FormGroup>
                    <TextField id="tags" label="Tags" variant="outlined" fullWidth disabled={true} helperText="Custom tags will be available in a future update."/>
                    <Button disabled={isLoading} sx={{alignSelf:"end"}} variant={"outlined"} onClick={(e) => {
                        e.preventDefault();
                        void create()
                    }}>Create</Button>
                </Stack>
            </Box>
        </Box>
    );
}
