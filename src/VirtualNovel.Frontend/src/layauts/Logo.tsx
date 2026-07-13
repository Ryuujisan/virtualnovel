import {Box, Typography} from "@mui/material";

export default function Logo() {
    return (
        <Box
            sx={{
                position: "relative",
                minHeight: { xs: 180, sm: 220, md: 260 },
                display: "flex",
                alignItems: "center",
                overflow: "hidden",

                backgroundImage:
                    'url("https://thumbs.dreamstime.com/b/flying-magic-books-library-367534733.jpg?w=992")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                marginBottom: 3,
                borderRadius: 1,
            }}
        >
            {/* przyciemnienie tła */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(90deg, rgba(15, 5, 30, 0.82) 0%, rgba(15, 5, 30, 0.35) 45%, rgba(15, 5, 30, 0.2) 100%)",
                }}
            />

            {/* treść */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    px: { xs: 2, sm: 4 },
                    py: 3,
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontFamily: '"Pacifico", cursive',
                        fontSize: {
                            xs: "2rem",
                            sm: "2.6rem",
                            md: "3.2rem",
                        },
                        color: "common.white",
                        WebkitTextStroke: "1px #030637",
                        textShadow:
                            "0 2px 8px rgba(0, 0, 0, 0.75)",
                        lineHeight: 1.1,
                    }}
                >
                    VirtualNovel
                </Typography>

                <Typography
                    sx={{
                        mt: 1.5,
                        fontFamily: '"Coming Soon", cursive',
                        fontSize: {
                            xs: "0.85rem",
                            sm: "1rem",
                        },
                        color: "rgba(255,255,255,0.88)",
                        textShadow:
                            "0 2px 4px rgba(0,0,0,0.8)",
                    }}
                >
                    unleash your imagination...
                </Typography>
            </Box>
        </Box>
    );
}
