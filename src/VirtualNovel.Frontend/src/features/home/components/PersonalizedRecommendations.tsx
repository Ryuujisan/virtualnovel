import NovelCard from "./NovelCard.tsx";
import {Stack, Typography} from "@mui/material";
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

            </Stack>
        </TitledBox>
    )
}
