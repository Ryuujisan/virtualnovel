import {Avatar, Box, Button, Chip, Grid, Rating, Stack, Typography} from "@mui/material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import UpdateIcon from '@mui/icons-material/Update';
import ChapterTable from "./ChapterTable.tsx";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import EmailIcon from '@mui/icons-material/Email';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

import type {NovelDto} from "../type.ts";
import {Link, useNavigate} from "react-router-dom";
import {formatUpdatedAt} from "../../../shared/helper.ts";
import {useUserStore} from "../../../store/userStore.ts";
import EditIcon from "@mui/icons-material/EditOutlined";


interface NovelProps {
    novel: NovelDto;
}

export default function NovelContent({novel}:NovelProps) {
    const currentUser = useUserStore((state) => state.user);
    const canEdit = Boolean(
        novel.author.authorId &&
        currentUser?.firebaseUid &&
        novel.author.authorId === currentUser.firebaseUid,
    );
    const navigate = useNavigate();
    return (
        <>
            <Grid container spacing={1}>
                <Grid size={2}>
                    <Stack>
                        <img src={novel.coverUrl || undefined} alt={"cover"} />
                        <Rating name="half-rating-read" defaultValue={novel?.rating ?? 0} value={novel?.rating ?? 0} precision={0.5}/>
                    </Stack>
                </Grid>
                <Grid size={9}>
                    <Stack direction={"row"} spacing={2}>
                    <Typography variant="h4" gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    }}>{novel?.title}</Typography>
                        {canEdit && (
                            <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    navigate(`/novelwriter?novelId=${novel.id}`);
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ flexGrow: 1,  marginBottom: 2}}>
                        <Chip
                            label={novel?.status}
                            size="small"
                            color={
                                novel?.status.toLowerCase() === "complete"
                                    ? "success"
                                    : "primary"
                            }
                        />
                        <Chip
                            label={novel?.workType}
                            size="small"
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
                        <Typography><UpdateIcon/> {formatUpdatedAt(novel?.updatedAt ?? "1.01.1990")} last update</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ flexGrow: 1,  marginBottom: 2}}>
                        {novel?.genres.map(item => (<Chip component={Link} to={`/novels/?genre=${item}&sort=updatedAt`} label={item} key={item} sx={{
                            fontWeight: 700,
                        }}/>))}
                    </Stack>
                    <Typography variant="body2" gutterBottom>Tags:</Typography>
                    <Typography variant="body2" gutterBottom>W I P</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexGrow: 1,  marginBottom: 2}}>
                        <Button color="secondary" variant={"contained"} startIcon={<SubscriptionsIcon/>}>Subscribe</Button>
                        <Button color="primary" variant={"contained"} startIcon={<LocalLibraryIcon/>}>Continue Reading</Button>
                    </Stack>
                </Grid>
                <Grid size={1} sx={{alignItems: "center"}}>
                    <Stack
                        spacing={2}
                        sx={{alignItems:"center"}}
                    >
                        <Avatar
                            alt={novel.author.name}
                            src={novel.author.avatarUrl || undefined}
                            sx={{ width: 125, height: 125 }}
                        />

                        <Typography
                            component={Link}
                            to={`/profile/${novel?.author.authorId}`}
                            variant="h6"
                            sx={{
                                textDecoration: "none",
                                color: "text.primary",
                                fontWeight: 600,

                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}
                        >
                            {novel?.author.name}
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<EmailIcon />}
                        >
                            DM
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <Box>
                <Typography variant="h4" gutterBottom>Summary</Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"

                    sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {novel?.description ?? ""}
                </Typography>
                <ChapterTable chapters={novel?.chapters ?? []} novelId={novel?.id ?? ""} />
            </Box>
        </>
    )
}
