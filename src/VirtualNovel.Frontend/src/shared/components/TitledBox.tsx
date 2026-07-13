import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface TitledBoxProps {
    title: string;
    children: ReactNode;
    sx?: SxProps<Theme>;
}

export default function TitledBox({
                                      title,
                                      children,
                                      sx,
                                  }: TitledBoxProps) {
    return (
        <Box
            component="fieldset"
            sx={[
                {
                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    padding: 3,
                    backgroundColor: "background.paper",

                    "& legend": {
                        padding: "0 8px",
                        color: "primary.main",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                    },
                },
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
        >
            <Typography component="legend">
                {title}
            </Typography>

            {children}
        </Box>
    );
}