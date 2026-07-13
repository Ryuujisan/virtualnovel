import TitledBox from "../../../shared/components/TitledBox.tsx";
import {Box} from "@mui/material";


export default function Forum() {
    return (
        <TitledBox title={"Forum"}>
            <Box
                sx={{
                    position: "relative",
                    minHeight: { xs: 180, sm: 220, md: 260 },
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",

                    backgroundImage:
                        'url("/wip.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    marginBottom: 3,
                    borderRadius: 1,
                }}
            />
        </TitledBox>
    )
}
