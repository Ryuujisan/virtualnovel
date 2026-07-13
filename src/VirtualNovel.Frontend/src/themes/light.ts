import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#A7D8FF",
            light: "#D9EEFF",
            dark: "#78B7E7",
            contrastText: "#2C3550",
        },

        secondary: {
            main: "#F7C9D9",
            light: "#FFE5EE",
            dark: "#D8A5B6",
            contrastText: "#2C3550",
        },

        background: {
            default: "#FAF8FF",
            paper: "#FFFFFF",
        },

        text: {
            primary: "#2C3550",
            secondary: "#66708C",
        },
    },

    shape: {
        borderRadius: 12,
    },
});