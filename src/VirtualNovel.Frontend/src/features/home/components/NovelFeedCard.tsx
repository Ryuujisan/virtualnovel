import {
    Box,
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
import {Link} from "react-router-dom";

export default function NovelFeedCard(data: NovelFeed) {
    function formatUpdatedAt(value: string): string {
        return new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
        }).format(new Date(value));
    }
    console.log(data.updatedAt);
    console.log(typeof data.updatedAt);
    return (
        <Card
            sx={{
                width: "100%",
                minHeight: 220,
                overflow: "hidden",
            }}
        >
            <CardActionArea
                component={Link}
                to={`/novels/${data.id}`}
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
                        bgcolor: "background.default",
                    }}
                >
                    <CardMedia
                        component="img"
                        image={data.coverUrl ?? ""}
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
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated: {formatUpdatedAt(data.updatedAt)}
                        </Typography>

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
