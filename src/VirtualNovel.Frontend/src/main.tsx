import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Root} from "./App/routes/Root.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ColorModeProvider} from "./themes/ColorModeProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ColorModeProvider>
                <Root />
            </ColorModeProvider>
        </QueryClientProvider>
    </StrictMode>
)
