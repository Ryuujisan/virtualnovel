import {Link, useNavigate, useParams} from "react-router-dom";
import {Autocomplete, Box, Button, Chip, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import type {NovelDto} from "../features/novels/type.ts";
import type {ChapterDto} from "../features/chapters/type.ts";
import {getChapter} from "../shared/api/api.chapter.ts";
import {getNovel} from "../shared/api/api.novel.ts";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";



export default function Chapter() {
    const {novelId} = useParams<{ novelId: string}>();
    const {order} = useParams<{order: string}>();
    console.log(order);
    const [novel, setNovel] = useState<NovelDto>();
    const [chapter, setChapter] = useState<ChapterDto>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nextOrder, setNextOrder] = useState(0);
    const [prevOrder, setPrevOrder] = useState(0);


    useEffect(() => {
        async function fetchChapter() {
            if (!novelId || !order) {
                return;
            }

            setIsLoading(true);

            try {
                const [chapterData, novelData] = await Promise.all([
                    getChapter(novelId, order),
                    getNovel(novelId),
                ]);

                setPrevOrder(chapterData.order - 1);
                setNextOrder(chapterData.order + 1);
                setChapter(chapterData);
                setNovel(novelData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        void fetchChapter();
    }, [novelId, order]);

    const navigate = useNavigate();

    const selectedChapter =
        novel?.chapters.find(
            chapter => chapter.order === Number(order)
        ) ?? null;

    return (
        <Stack>
            <Box >
                <Stack direction={"row"} spacing={2}>
                    <img src={novel?.coverUrl ?? ""} width={150} height={200}/>
                    <Stack>
                        <Typography variant="h5" component="div">
                            {novel?.title}
                        </Typography>
                    <Typography component={Link}
                                to={`/profile/${novel?.author.authorId}`}
                            sx={{
                                textDecoration: "none",
                                color: "text.primary",
                                fontWeight: 600,

                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}>Writer: {novel?.author.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"

                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {novel?.description}
                        </Typography>
                        <Stack direction={"row"} spacing={2} sx={{marginTop: 2}}>
                            <Chip
                                label={novel?.status}
                                size="small"
                                color={
                                    novel?.status.toLowerCase() === "complete"
                                        ? "success"
                                        : "primary"
                                }
                            />
                            {novel?.romanceType !== "None" && (
                                <Chip
                                    label={novel?.romanceType}
                                    size="small"
                                    color="secondary"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                />
                            )}
                            <Typography><LibraryBooksIcon/> {novel?.chapters.length} chapter</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
            <Autocomplete
                disablePortal
                options={novel?.chapters ?? []}
                value={selectedChapter}
                getOptionKey={(option) => option.order}
                getOptionLabel={(option) =>
                    `${option.order}. ${option.title}`
                }
                isOptionEqualToValue={(option, value) =>
                    option.order === value.order
                }
                onChange={(_, chapter) => {
                    if (chapter) {
                        navigate(
                            `/novels/${novelId}/chapter/${chapter.order}`
                        );
                    }
                }}
                sx={{ width: 300, alignSelf: "end" }}
                renderInput={(params) => (
                    <TextField {...params} label="Chapters" />
                )}
            />
            <Typography sx={{alignSelf: "center"}} variant={"h3"}>{chapter?.title}</Typography>
            <Typography
                sx={{
                    mt: 4,
                    whiteSpace: "pre-line",
                    lineHeight: 2,
                    fontSize: "1.1rem",
                }}>{chapter?.content}</Typography>
            <Stack direction={"row"} spacing={2} sx={{alignSelf:"end"}}>
                {
                    (chapter?.order! > 1) && (<Button component={Link} to={`/novels/${novelId}/chapter/${prevOrder}`} variant={"contained"}>Back</Button>)
                }
                {
                    (nextOrder < novel?.chapters.length!) && (<Button component={Link} to={`/novels/${novelId}/chapter/${nextOrder}`} variant={"contained"}>Next</Button>)
                }
            </Stack>
        </Stack>
    )
}
