import {Stack} from "@mui/material";

import Forum from "../features/home/components/Forum.tsx";
import PersonalizedRecommendations from "../features/home/components/PersonalizedRecommendations.tsx";
import LastUpdate from "../features/home/components/LastUpdate.tsx";

export default function Home() {
    return (
        <Stack spacing={2}>
            <Forum />
            <PersonalizedRecommendations/>
            <LastUpdate />
        </Stack>
    )
}
