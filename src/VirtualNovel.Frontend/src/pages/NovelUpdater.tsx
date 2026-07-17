import {Navigate, useParams} from "react-router-dom";
import NovelEditor from "../shared/components/NovelEditor.tsx";
import {Stack} from "@mui/material";

export default function NovelUpdater() {
    const {id} = useParams<{ id: string }>();
    if (id === undefined || id === "") {
        return <Navigate to="/create" replace/>
    } else {
        return (
                <Stack direction="column" spacing={2}>
                <NovelEditor mode="update" novelId={id}/>
                </Stack>
            )
    }
}
