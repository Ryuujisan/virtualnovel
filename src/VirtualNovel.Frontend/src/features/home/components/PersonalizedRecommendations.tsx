import NovelCard from "./NovelCard.tsx";
import {Stack} from "@mui/material";
import TitledBox from "../../../shared/components/TitledBox.tsx";

export default function PersonalizedRecommendations() {
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
                <NovelCard id={"test"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={4.5} />
                <NovelCard id={"test1"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={2} />
                <NovelCard id={"test2"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={4.5} />
                <NovelCard id={"test3"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={5} />
                <NovelCard id={"test4"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={5.5} />
                <NovelCard id={"test4"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={5.5} />
                <NovelCard id={"test4"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={5.5} />
                <NovelCard id={"test4"} title={"Neko Mate"} coverUrl={"https://cdn.scribblehub.com/images/32/Harry-Potter-and-Neko-Mate_651044_1672400295.jpg"} rating={5.5} />
            </Stack>
        </TitledBox>
    )
}
