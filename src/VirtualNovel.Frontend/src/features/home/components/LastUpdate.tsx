import {Box, Stack, Typography} from "@mui/material";
import type {NovelFeed} from "../Type.ts";
import NovelFeedCard from "./NovelFeedCard.tsx";

export default function LastUpdate() {

    const novel: NovelFeed = {
        coverUrl: "https://cdn.scribblehub.com/seriesimg/mid/122/mid_2443122.jpg",
        genres: ["Ramance", "Martial Arts"],
        title: "Neko trouble",
        rating: 4.5,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
        romance: "Yuri",
        status: "publishing",
        id: "test",
        updatedAt: "10.07.2026"
    }
    return (
        <Stack spacing={2} sx={{ flex: 1, marginTop: 2 }}>
            <Typography variant="h5" component="div">Last Update</Typography>
            <Box sx={{ alignContent: "center" }}>
                <NovelFeedCard {...novel} />
                <NovelFeedCard {...novel} />
            </Box>
        </Stack>
    )
}
