import {Chip, Typography} from "@mui/material";
import {useSearchParams} from "react-router-dom";

export default function NovelsSearch() {
    const [searchParams] = useSearchParams();

    const genres =     searchParams
        .get("genre")
        ?.split(",")
        .filter(Boolean) ?? [];
    const romance = searchParams.get("romance");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort");
    return (
        <div>
            <Typography>Romance {romance}</Typography>
            <Typography>status {status}</Typography>
            <Typography>sort {sort}</Typography>
            {genres.map(genre => (<Chip label={genre} id={genre} key={genre}/>))}

        </div>
    )
}
