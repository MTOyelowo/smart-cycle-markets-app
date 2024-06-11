import AppHeader from "@components/AppHeader";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@ui/BackButton";
import EmptyChat from "@ui/EmptyChat";
import EmptyView from "@ui/EmptyView";
import PeerProfile from "@ui/PeerProfile";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import useClient from "app/hooks/useClient";
import { AppStackParamList } from "app/navigator/AppNavigator";
import socket, { NewMessageResponse } from "app/socket";
import {
  Conversation,
  addConversation,
  selectConversationById,
  updateConversation,
} from "app/store/conversation";
import { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";

type Props = NativeStackScreenProps<AppStackParamList, "ChatWindow">;

type OutGoingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  to: string;
  conversationId: string;
};

const getTime = (value: IMessage["createdAt"]) => {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const formatConversationsToIMessage = (value?: Conversation): IMessage[] => {
  const formattedValues = value?.chats.map((chat) => {
    return {
      _id: chat.id,
      text: chat.text,
      createdAt: new Date(chat.time),
      user: {
        _id: chat.user.id,
        name: chat.user.name,
        avatar: chat.user.avatar,
      },
    };
  });

  const messages = formattedValues || [];

  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

let timeoutId: NodeJS.Timeout | null;
const TYPING_TIMEOUT = 2000;

const ChatWindow: FC<Props> = ({ route }) => {
  const { authState } = useAuth();
  const { authClient } = useClient();
  const { conversationId, peerProfile } = route.params;
  const chats = useSelector(selectConversationById(conversationId));
  const dispatch = useDispatch();
  const profile = authState.profile;

  const [fetchingChats, setFetchingChats] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  const handleOnMessageSend = (messages: IMessage[]) => {
    if (!profile) return;

    const currentMessage = messages[messages.length - 1];

    const newMessage: OutGoingMessage = {
      message: {
        id: currentMessage._id.toString(),
        text: currentMessage.text,
        time: getTime(currentMessage.createdAt),
        user: { id: profile.id, name: profile.name, avatar: profile.avatar },
      },
      conversationId,
      to: peerProfile.id,
    };

    //update store and UI
    dispatch(
      updateConversation({
        conversationId,
        chat: newMessage.message,
        peerProfile,
      })
    );

    // Sending message to API
    socket.emit("chat:new", newMessage);
  };

  const emitTypingEnd = (timeout: number) => {
    return setTimeout(() => {
      socket.emit("chat:typing", { active: false, to: peerProfile.id });
      timeoutId = null;
    }, timeout);
  };
  // Notify that user is typing;
  const handleOnInputChange = () => {
    // 3: If user is still typing and then invalidates the previous typing end request
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = emitTypingEnd(TYPING_TIMEOUT);
    } else {
      // 1: Typing is started: send request to the server
      socket.emit("chat:typing", { active: true, to: peerProfile.id });

      // 2: Also send typing is end: send request to the server
      timeoutId = emitTypingEnd(TYPING_TIMEOUT);
    }
  };

  const fetchOldChats = async () => {
    setFetchingChats(true);
    const res = await runAxiosAsync<{ conversation: Conversation }>(
      authClient(`/conversation/chats/${conversationId}`)
    );
    setFetchingChats(false);

    if (res?.conversation) {
      dispatch(addConversation([res.conversation]));
    }
  };

  const sendSeenRequest = () => {
    runAxiosAsync(
      authClient.patch(`/conversation/seen/${conversationId}/${peerProfile.id}`)
    );
  };

  const updateTypingStatus = (data: { typing: boolean }) => {
    setTyping(data.typing);
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      await fetchOldChats();
      await sendSeenRequest();
    };
    handleApiRequest();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const updateSeenStatus = (data: NewMessageResponse) => {
        socket.emit("chat:seen", {
          messageId: data.message.id,
          conversationId,
          peerId: peerProfile.id,
        });
      };
      socket.on("chat:message", updateSeenStatus);
      socket.on("chat:typing", updateTypingStatus);

      return () => {
        socket.off("chat-message", updateSeenStatus);
        socket.off("chat-typing", updateTypingStatus);
      };
    }, [])
  );

  if (!profile) return null;

  if (fetchingChats) return <EmptyView title="Please wait" />;

  return (
    <View style={styles.container}>
      <AppHeader
        back={<BackButton />}
        right={
          <PeerProfile name={peerProfile.name} avatar={peerProfile.avatar} />
        }
      />
      <GiftedChat
        messages={formatConversationsToIMessage(chats)}
        user={{
          _id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        }}
        onSend={(message) => handleOnMessageSend(message)}
        renderChatEmpty={() => <EmptyChat />}
        onInputTextChanged={handleOnInputChange}
        isTyping={typing}
      />
    </View>
  );
};

export default ChatWindow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
