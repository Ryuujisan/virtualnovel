import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    type User,
} from "firebase/auth";

import { firebaseAuth } from "./firebase";
import type {UserProfileDto} from "../../features/profile/type.ts";
import type {EnsureProfileRequest} from "../../features/profile/request.ts";
import {getCurrentUserProfile, updateProfile} from "../../features/profile/api.ts";


type AuthenticatedUser = {
    firebaseUser: User;
    profile: UserProfileDto;
};


const googleProvider = new GoogleAuthProvider();

export function getHigherResolutionGoogleAvatar(
    url: string | null | undefined,
): string | null {
    if (!url) {
        return null;
    }

    return url.replace(/=s\d+-c(?:-no)?$/, "=s288-c-no");
}

async function ensureUserProfile(
    user: User,
): Promise<UserProfileDto> {
    const request: EnsureProfileRequest = {
        name:
            user.displayName ??
            user.email?.split("@")[0] ??
            "New user",

        avatarUrl: getHigherResolutionGoogleAvatar(user.photoURL) ?? undefined,
    };

    const response = await updateProfile(request) as UserProfileDto;

    return response;
}

export async function signInWithEmail(
    email: string,
    password: string,
): Promise<UserProfileDto> {
       await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim().toLowerCase(),
        password,
    );

    return await getCurrentUserProfile() as UserProfileDto;
}

export async function registerWithEmail(
    email: string,
    password: string,
): Promise<AuthenticatedUser> {
    const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email.trim().toLowerCase(),
        password,
    );

    const profile = await ensureUserProfile(credential.user);

    return {
        firebaseUser: credential.user,
        profile,
    };
}

export async function signInWithGoogle(): Promise<AuthenticatedUser> {
    const credential = await signInWithPopup(
        firebaseAuth,
        googleProvider,
    );

    let profile: UserProfileDto;

    try {
        profile = await getCurrentUserProfile();
    } catch (error) {
        profile = await ensureUserProfile(credential.user);
    }

    return {
        firebaseUser: credential.user,
        profile,
    };
}

export function signOutUser(): Promise<void> {
    return signOut(firebaseAuth);
}