import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import client, { baseURL } from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { TokenResponse } from "app/hooks/useClient";
import { Profile, updateAuthState } from "app/store/auth";
import { updateConversation } from "app/store/conversation";
import { io } from "socket.io-client";

const socket = io(baseURL, { path: "/socket-message", autoConnect: false });

type UserProfile = {
  id: string;
  name: string;
  avatar?: string;
};

export type NewMessageResponse = {
  message: {
    id: string;
    time: string;
    text: string;
    user: UserProfile;
  };
  from: UserProfile;
  conversationId: string;
};


export const handleSocketConnection = (profile: Profile, dispatch: Dispatch<UnknownAction>) => {
  socket.auth = { token: profile.accessToken };
  socket.connect();

  socket.on("chat:message", (data: NewMessageResponse) => {
    const { conversationId, from, message } = data;
    //This will update ongoing coversationss or messages in between two users.

    dispatch(
      updateConversation({
        conversationId,
        chat: message,
        peerProfile: from
      })
    )
  })

  socket.on("connect_error", async (error) => {
    if (error.message === "jwt expired") {
      const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN)
      const res = await runAxiosAsync<TokenResponse>(client.post(`${baseURL}/auth/refresh-token`, { refreshToken }));

      if (res) {
        await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access)
        await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh)
        dispatch(updateAuthState({ profile: { ...profile, accessToken: res.tokens.access }, pending: false }));
      }

      socket.auth = { token: res?.tokens.access }
      socket.connect();
    }

  });

}

export default socket;