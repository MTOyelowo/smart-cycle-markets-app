import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { getAuthState, updateAuthState } from "app/store/auth";
import { useDispatch, useSelector } from "react-redux";

export interface SignInResponse {
    profile: {
        id: string;
        email: string;
        name: string;
        verified: boolean;
        avatar?: string;
    };
    tokens: {
        refresh: string;
        access: string;
    };
}

type UserInfo = {
    email: string;
    password: string
}

const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector(getAuthState);
    const loggedIn = authState.profile ? true : false;

    const signIn = async (userInfo: UserInfo) => {
        dispatch(updateAuthState({ profile: null, pending: true }));
        const res = await runAxiosAsync<SignInResponse>(
            client.post("/auth/sign-in", userInfo)
        );

        if (res) {
            await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access)
            await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh)
            dispatch(updateAuthState({ profile: { ...res.profile, accessToken: res.tokens.access }, pending: false }));
        } else {

            dispatch(updateAuthState({ profile: null, pending: false }));
        }
    }

    return { signIn, authState, loggedIn }

};

export default useAuth;