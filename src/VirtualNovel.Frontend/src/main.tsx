import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {lightTheme} from "./themes/light.ts";
import {darkTheme} from "./themes/dark.ts";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {Root} from "./App/routes/Root.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const theme = true
    ? darkTheme
    : lightTheme;

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Root />
        </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
)
