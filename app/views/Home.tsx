import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FC, useEffect, useState } from "react";
import ChatNotification from "@ui/ChatNotification";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "app/navigator/AppNavigator";
import SearchBar from "@components/SearchBar";
import size from "@utils/size";
import CategoriesList from "@components/CategoriesList";
import LatestProductsList, {
  LatestProduct,
} from "@components/LatestProductsList";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import socket, { handleSocketConnection } from "app/socket";
import useAuth from "app/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveChat,
  addNewActiveChats,
  getUnreadChatCounts,
} from "app/store/chats";
import SearchModal from "@components/SearchModal";

interface Props {}

type LastChat = {
  id: string;
  lastMessage: string;
  timestamp: Date;
  unreadChatCounts: number;
  peerProfile: { id: string; name: string; avatar?: string };
};

const Home: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const { authClient } = useClient();
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const totalUnreadMessages = useSelector(getUnreadChatCounts);

  const [products, setProducts] = useState<LatestProduct[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );

    if (res?.products) {
      setProducts(res.products);
    }
  };

  const fetchLastChats = async () => {
    const res = await runAxiosAsync<{ chats: ActiveChat[] }>(
      authClient("/conversation/last-chats")
    );

    if (res) {
      dispatch(addNewActiveChats(res.chats));
    }
  };

  useEffect(() => {
    fetchLatestProduct();
    fetchLastChats();
  }, []);

  useEffect(() => {
    if (authState.profile) handleSocketConnection(authState.profile, dispatch);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <ChatNotification
        onPress={() => navigate("Chats")}
        indicate={totalUnreadMessages > 0}
      />
      <ScrollView style={styles.container}>
        <SearchBar asButton onPress={() => setShowSearchModal(true)} />
        <CategoriesList
          onPress={(category) => navigate("ProductsList", { category })}
        />
        <LatestProductsList
          data={products}
          onPress={(product) => navigate("SingleProduct", { id: product.id })}
        />
      </ScrollView>
      <SearchModal visible={showSearchModal} onClose={setShowSearchModal} />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    flex: 1,
  },
});
