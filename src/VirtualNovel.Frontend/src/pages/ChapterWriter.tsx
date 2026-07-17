import ChapterEditor from "../features/chapters/components/ChapterEditor.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {createChapter, getChapterById} from "../features/chapters/api.ts";
import {Box, Button, Stack, TextField} from "@mui/material";


export default function ChapterWriter() {
    const {id, chapterId} = useParams<{ id: string, chapterId : string }>();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        if (id === undefined || id === "") {
            toast.error("Novel is required");
           // navigate("/create");
        }

        if(chapterId === undefined || chapterId === "") {
            return;
        }
        setIsLoading(true);
        async function fetchChapter() {
           try {

            const chapter = await getChapterById(chapterId!);
            setFormData({
                title: chapter.title,
                description: "",
                content: chapter.content,
            })
           } catch (error) {
               toast.error("Failed to fetch chapter");
           }
           finally {
               setIsLoading(false);
           }
        }
        void fetchChapter()
    },[id,chapterId])
    async function create() {
        setIsLoading(true);
        try {
            await createChapter({
                chapterDescription : "",
                content : formData.content,
                chapterName : formData.title,
                novelId : id!
            })
            toast.success("Chapter created");
            navigate(`/novelupdate/${id}`)
        } catch (e) {

        } finally {
            setIsLoading(false);
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
            }}>
            <Stack spacing={2}>
            <TextField
                value={formData.title}
                id="Title"
                label="Title"
                fullWidth
                disabled={isLoading}
                onChange={(event) =>
                    setFormData((current) => ({...current, title: event.target.value}))}
            />
        <ChapterEditor value={formData.content} onChange={(content: string) => {
             setFormData({...formData, content: content})
        }}/>
                <Button sx={{alignSelf:"end"}} variant={"outlined"}  onClick={(e) => {
                    e.preventDefault();
                    void create();
                }}>Create</Button>
            </Stack>
        </Box>
    )
}
