import {Navigate, useLocation} from "react-router-dom";
import {useUserStore} from "../store/userStore.ts";
import MainLayout from "./MainLayout.tsx";
import {LinearProgress} from "@mui/material";

export default function ProtectedRoute() {
    const isAuthenticated = useUserStore(x => x?.user !== null);
    const isChecked = useUserStore(x => x.isChecked);
    const location = useLocation();

    if(isChecked) {
       return <LinearProgress aria-label="Loading…" />
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <MainLayout />;
}
