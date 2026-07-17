import {Card, CardActionArea, CardContent, CardMedia, Rating, Typography} from "@mui/material";
import type {NovelCardInfo} from "../Type.ts";
import {Link} from "react-router-dom";

export default function NovelCard({id, coverUrl, title, rating} : NovelCardInfo ) {
    return (
        <Card id={id} sx={{ width: 200 }}>
            <CardActionArea
                component={Link}
                to={`/novels/${id}`}>
                <CardMedia
                    component="img"
                    image={coverUrl ?? "/cover.png"}
                    alt="Cover"
                />
                <CardContent>
                    <Typography gutterBottom>
                        {title}
                    </Typography>
                    <Rating name="half-rating-read" defaultValue={rating} precision={0.5} readOnly />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
