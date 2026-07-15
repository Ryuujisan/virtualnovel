import {Stack} from "@mui/material";

export default function Think() {
    return (
        <Stack direction="row" sx={{mx: "auto"}}>
            <img
                src={"/wip.png"} alt="CalendarMonth"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }}/>
        </Stack>
    )
}
