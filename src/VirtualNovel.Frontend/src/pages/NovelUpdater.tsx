import {Navigate, useNavigate, useParams} from "react-router-dom";
import NovelEditor from "../shared/components/NovelEditor.tsx";
import {Button, Stack} from "@mui/material";

export default function NovelUpdater() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    if (id === undefined || id === "") {
        return <Navigate to="/create" replace/>
    } else {
        return (
                <Stack direction="column" spacing={2}>
                <NovelEditor mode="update" novelId={id}/>
                    <Button variant="contained" color="secondary" onClick={() => {
                        navigate(`/novel/${id}/chaptereditor/`);
                    }}>
                        Add Chapter
                    </Button>
                </Stack>
            )
    }
}
