import { useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {UserProfileDto} from "../features/profile/type.ts";
import {getProfiles} from "../features/profile/api.ts";
import {Grid} from "@mui/material";
import ProfileInfo from "../features/profile/components/ProfileInfo.tsx";
import ProfileTab from "../features/profile/components/ProfileTab.tsx";



export default function Profile() {
    let { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function fetch() {
            setIsLoading(true);
            const user = await getProfiles(id!) as UserProfileDto;
            console.log(user);
            setUser(user);
            setIsLoading(false);
        }
        void fetch();
    }, [id]);
    return (
        <Grid container spacing={2} sx={{mx: "auto", marginBottom: "2rem"}}>
            <Grid size = {3} sx={{background: "primary"}}>
                {!isLoading && (<ProfileInfo user={user!}/>)}
            </Grid>
            <Grid size={9}>
                {!isLoading && (<ProfileTab user={user!}/>)}

            </Grid>
        </Grid>
    )
}
