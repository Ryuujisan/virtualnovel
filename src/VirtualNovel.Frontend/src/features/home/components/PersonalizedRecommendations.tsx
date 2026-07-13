import NovelCard from "./NovelCard.tsx";
import {Stack} from "@mui/material";
import TitledBox from "../../../shared/components/TitledBox.tsx";
import { useEffect, useState} from "react";
import type {NovelFeed} from "../Type.ts";
import {getNovels} from "../../../shared/api/api.home.ts";
import type {NovelQuery} from "../../../shared/api/api.request.home.ts";


export default function PersonalizedRecommendations() {
    const [novels , setNovels] = useState<NovelFeed[]>();
    const filters : NovelQuery = {
        page : 1,
        pageSize: 6,
        sort : "rating"
    }

    useEffect(() => {
       async function fetchNovels() {
           const data = await getNovels(
               filters,
           )
           setNovels(data);
       }
       fetchNovels();
    },[])

    return (
        <TitledBox title="You Might Like ">
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,

                    overflowX: "auto",
                    overflowY: "hidden",
                    pb: 1,

                    "& > *": {
                        flexShrink: 0,
                    },

                    scrollbarWidth: "thin",
                }}
            >
                {
                    novels?.map((novel) => (
                        <NovelCard id={novel.id } key={novel.id +"rating"} title={novel.title} coverUrl={novel.coverUrl ?? ""} rating={novel.rating}/>
                    ))
                }
            </Stack>
        </TitledBox>
    )
}
