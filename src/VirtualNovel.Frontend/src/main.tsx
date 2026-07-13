import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {lightTheme} from "./themes/light.ts";
import {darkTheme} from "./themes/dark.ts";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {Root} from "./App/routes/Root.tsx";

const theme = true
    ? darkTheme
    : lightTheme;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Root />
        </ThemeProvider>
    </StrictMode>
)
