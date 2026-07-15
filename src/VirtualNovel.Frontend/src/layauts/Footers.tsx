import {Stack, Typography} from "@mui/material";

export default function Footers() {
    const data = new Date();
    return (
        <Stack spacing={2} sx={{
            flexGrow: 1,
            alignItems: "center",
            marginTop: "1rem",
        }}>
            <Typography>Term of Service | About us | Contact us</Typography>
            <Typography>{data.getFullYear()}©Virtual Novel</Typography>
        </Stack>
    )}
