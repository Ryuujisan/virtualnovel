import {RouterProvider} from "react-router/dom";
import {routes} from "./Routes.tsx";
import {useEffect} from "react";
import {getCurrentUserProfile} from "../../features/profile/api.ts";

import {useUserStore} from "../../store/userStore.ts";
import {firebaseAuth} from "../../shared/auth/firebase.ts";
import {onAuthStateChanged} from "firebase/auth"


export const Root = () => {
        const setUserProfile = useUserStore(x => x.setUser);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            firebaseAuth,
            async firebaseUser => {
                if (!firebaseUser) {
                    setUserProfile(null!);
                    return;
                }

                try {
                    const user =
                        await getCurrentUserProfile();

                    setUserProfile(user);
                }
                catch {
                    setUserProfile(null!);
                }
            }
        );

        return unsubscribe;
    }, []);
    return <RouterProvider router={routes} />;
};
