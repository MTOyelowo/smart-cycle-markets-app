import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface UserProfile {
    id: string;
    name: string
    avatar?: string;
}

interface Chat {
    text: string;
    time: string;
    id: string;
    user: UserProfile;
}

export interface Conversation {
    id: string;
    chats: Chat[];
    peerProfile: { avatar?: string; name: string; id: string };
}

type UpdatePayload = {
    chat: Chat;
    conversationId: string;
    peerProfile: UserProfile;
};

interface InitialState {
    conversations: Conversation[]
}

const initialState: InitialState = {
    conversations: [],
}

const slice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        addConversation(state, { payload }: PayloadAction<InitialState["conversations"]>) {
            state.conversations = payload
        },

        updateConversation({ conversations }, { payload }: PayloadAction<UpdatePayload>) {
            const index = conversations.findIndex(({ id }) => id === payload.conversationId);
            //If index is -1, create new conversation as there is no existing conversation for the id.
            if (index === -1) {
                conversations.push({
                    id: payload.conversationId,
                    chats: [payload.chat],
                    peerProfile: payload.peerProfile
                });
            } else {
                conversations[index].chats.push(payload.chat);
            }
        }
    }
});

export const { addConversation, updateConversation } = slice.actions;

export const selectConversationById = (conversationId: string) => {
    return createSelector((state: RootState) => state, ({ conversation }) => {
        return conversation.conversations.find(({ id }) => conversationId);
    }
    );
};

export default slice.reducer;