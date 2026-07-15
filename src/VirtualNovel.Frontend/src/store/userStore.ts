import { create } from "zustand";
import type {UserProfileDto} from "../features/profile/type.ts";

type UserState = {
    user: UserProfileDto | null;

    setUser: (user: UserProfileDto) => void;
    updateUser: (user: Partial<UserProfileDto>) => void;
}

export const useUserStore = create<UserState>(
    (set) => ({
        user: null,

        setUser: (user: UserProfileDto | null) => set({user}),
        updateUser: (partialUser) =>
            set((state) => ({
                user: state.user
                    ? {
                        ...state.user,
                        ...partialUser,
                    }
                    : null,
            })),
    }))