
import {Box, Typography} from "@mui/material";

export default function NotFound() {
    return (
        <Box
            sx={{
                minHeight: "50vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                py: 4,
            }}
        >
            <Box
                component="img"
                src="/notfound.png"
                alt="Page not found"
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    maxHeight: { xs: 260, md: 420 },
                    objectFit: "cover",
                    objectPosition: "center top",
                    borderRadius: 2,
                }}
            />

            <Typography variant="h4">
                Page not found
            </Typography>

            <Typography color="text.secondary">
                {/*This page wandered off into another timeline.*/}
                Yuriko searched everywhere, but this page seems to have disappeared.
            </Typography>
        </Box>
    )
}
