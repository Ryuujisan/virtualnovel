import { create } from "zustand";
import type {UserProfileDto} from "../features/profile/type.ts";

type UserState = {
    user: UserProfileDto | null;
    isChecked: boolean;
    setUser: (user: UserProfileDto) => void;
    setIsChecked: (isChecked: boolean) => void;
    updateUser: (user: Partial<UserProfileDto>) => void;
}

export const useUserStore = create<UserState>(
    (set) => ({
        user: null,
        isChecked: true,

        setUser: (user: UserProfileDto | null) => set({user}),
        setIsChecked: (isChecked) => set({isChecked}),
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