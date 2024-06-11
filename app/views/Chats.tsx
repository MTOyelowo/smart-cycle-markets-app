import AppHeader from "@components/AppHeader";
import RecentChat, { Separator } from "@components/RecentChat";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import BackButton from "@ui/BackButton";
import EmptyView from "@ui/EmptyView";
import colors from "@utils/colors";
import { formatDate } from "@utils/date";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { ProfileStackParamList } from "app/navigator/ProfileNavigator";
import {
  ActiveChat,
  getActiveChats,
  removeUnreadChatCount,
} from "app/store/chats";
import { FC, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

const Chats: FC<Props> = (props) => {
  const { authClient } = useClient();
  const chats = useSelector(getActiveChats);
  const dispatch = useDispatch();
  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  const sendSeenRequest = (conversationId: string, peerId: string) => {
    runAxiosAsync(
      authClient.patch(`/conversation/seen/${conversationId}/${peerId}`)
    );
  };

  const onChatPress = (chat: ActiveChat) => {
    // remove unread chats counts.
    dispatch(removeUnreadChatCount(chat.id));
    // update viewed property in database
    sendSeenRequest(chat.id, chat.peerProfile.id);
    // navigate to chat screen
    navigate("ChatWindow", {
      conversationId: chat.id,
      peerProfile: chat.peerProfile,
    });
  };

  if (!chats.length)
    return (
      <>
        <AppHeader back={<BackButton />} />
        <EmptyView title="There are no chats." />
      </>
    );

  return (
    <>
      <AppHeader back={<BackButton />} />
      <FlatList
        data={chats}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Pressable onPress={() => onChatPress(item)}>
            <RecentChat
              name={item.peerProfile.name}
              avatar={item.peerProfile.avatar}
              timestamp={item.timestamp}
              message={item.lastMessage}
              unreadMessageCount={item.unreadChatCounts}
            />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {},
  listContainer: {
    padding: size.padding,
  },
});
