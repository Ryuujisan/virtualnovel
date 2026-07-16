import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Rating,
    Stack,
    Typography,
} from "@mui/material";
import type { NovelFeed } from "../Type";
import EditIcon from "@mui/icons-material/EditOutlined";
import {useNavigate} from "react-router-dom";
import {formatUpdatedAt} from "../../../shared/helper.ts";
import {useUserStore} from "../../../store/userStore.ts";

export default function NovelFeedCard(data: NovelFeed) {
    const navigate = useNavigate();
    const currentUser = useUserStore((state) => state.user);
    const author = data.author;
    const authorName = author.name;
    const canEdit = Boolean(
        author.authorId &&
        currentUser?.firebaseUid &&
        author.authorId === currentUser.firebaseUid,
    );

    return (
        <Card
            sx={{
                width: "100%",
                minHeight: 220,
                overflow: "hidden",
            }}
        >
            <CardActionArea
                component="div"
                onClick={() => navigate(`/novels/${data.id}`)}
                sx={{
                    display: "flex",
                    alignItems: "stretch",
                    height: "100%",
                }}
            >
                {/* Lewa kolumna: okładka + rating */}
                <Box
                    sx={{
                        width: 130,
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",

                    }}
                >
                    <CardMedia
                        component="img"
                        image={data.coverUrl || undefined}
                        alt={`Cover of ${data.title}`}
                        sx={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 0.75,
                        }}
                    >
                        <Rating
                            value={data.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                    </Box>
                </Box>

                {/* Prawa kolumna */}
                <CardContent
                    sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.25,
                        position: "relative",
                    }}
                >
                    {/* Tytuł + status */}
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Stack direction={"row"} spacing={2}>
                        <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                                fontWeight: 700,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {data.title}
                        </Typography>
                        {canEdit && (
                            <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    navigate(`/novelwriter?novelId=${data.id}`);
                                }}
                            >
                                Edit
                            </Button>
                        )}
                        </Stack>
                        <Chip
                            label={data.status}
                            size="small"
                            color={
                                data.status.toLowerCase() === "complete"
                                    ? "success"
                                    : "primary"
                            }
                        />
                    </Stack>

                    {/* Gatunki */}
                    <Stack
                        direction="row"
                        sx={{
                            flexWrap: "wrap",
                            gap: 0.75,
                        }}
                    >
                        {data.genres.map((genre) => (
                            <Chip
                                key={genre}
                                label={genre}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Stack>

                    {/* Opis */}
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
                        {data.description}
                    </Typography>

                    {/* Dół karty */}
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: "auto",
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{alignItems: "center", minWidth: 0}}>
                            <Avatar
                                src={author.avatarUrl ?? undefined}
                                alt={authorName}
                                sx={{width: 28, height: 28, fontSize: 13}}
                            >
                                {authorName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{minWidth: 0}}>
                                <Typography variant="body2" noWrap sx={{fontWeight: 600}}>
                                    {authorName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Updated: {formatUpdatedAt(data.updatedAt)}
                                </Typography>
                            </Box>
                        </Stack>

                        {data.romance !== "None" && (
                            <Chip
                                label={data.romance}
                                size="small"
                                color="secondary"
                                sx={{
                                    fontWeight: 700,
                                }}
                            />
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
