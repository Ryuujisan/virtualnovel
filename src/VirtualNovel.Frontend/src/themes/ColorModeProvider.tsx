import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { PaletteMode } from "@mui/material";
import type { PropsWithChildren } from "react";
import { ColorModeContext } from "./ColorModeContext.ts";
import type { ColorModeContextValue } from "./ColorModeContext.ts";
import { darkTheme } from "./dark.ts";
import { lightTheme } from "./light.ts";

const STORAGE_KEY = "virtual-novel-theme";

function getInitialMode(): PaletteMode {
    const savedMode = localStorage.getItem(STORAGE_KEY);

    if (savedMode === "light" || savedMode === "dark") {
        return savedMode;
    }

    if (typeof window.matchMedia === "function") {
        return window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark";
    }

    return "dark";
}

export function ColorModeProvider({ children }: PropsWithChildren) {
    const [mode, setMode] = useState<PaletteMode>(getInitialMode);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mode]);

    const contextValue = useMemo<ColorModeContextValue>(() => ({
        mode,
        toggleColorMode: () => {
            setMode((currentMode) => currentMode === "dark" ? "light" : "dark");
        },
    }), [mode]);

    return (
        <ColorModeContext.Provider value={contextValue}>
            <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
