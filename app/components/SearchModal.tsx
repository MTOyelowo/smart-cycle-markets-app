import { FC, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "./SearchBar";
import colors from "@utils/colors";
import size from "@utils/size";
import EmptyView from "@ui/EmptyView";
import LottieView from "lottie-react-native";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { debounce } from "@utils/helper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileStackParamList } from "app/navigator/ProfileNavigator";

interface Props {
  visible: boolean;
  onClose(visible: boolean): void;
}

const searchResult = [
  { id: 1, name: "iPhone 13 Pro Max" },
  { id: 2, name: "Samsung Galaxy S21" },
  { id: 3, name: "Sony PlayStation 5" },
  { id: 4, name: "Microsoft Xbox Series X" },
  { id: 5, name: "Nintendo Switch" },
  { id: 6, name: "Levi's 501 Original Jeans" },
  { id: 7, name: "Nike Air Max 270" },
  { id: 8, name: "Gucci GG Marmont Bag" },
  { id: 9, name: "The Great Gatsby by F. Scott Fitzgerald" },
  { id: 10, name: "To Kill a Mockingbird by Harper Lee" },
  { id: 11, name: "Apple MacBook Pro" },
  { id: 12, name: "Google Pixel 6" },
  { id: 13, name: "Adidas Ultraboost 21" },
  { id: 14, name: "Sony WH-1000XM4 Headphones" },
  { id: 15, name: "Amazon Kindle Paperwhite" },
  { id: 16, name: "Canon EOS R5 Camera" },
  { id: 17, name: "Ray-Ban Aviator Sunglasses" },
  { id: 18, name: "The Catcher in the Rye by J.D. Salinger" },
  { id: 19, name: "Animal Farm by George Orwell" },
  { id: 20, name: "The Alchemist by Paulo Coelho" },
];

type SearchResult = {
  id: string;
  name: string;
  thumbnail?: string;
};

const SearchModal: FC<Props> = ({ visible, onClose }) => {
  const { authClient } = useClient();
  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  //   const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleClose = () => {
    onClose(!visible);
  };

  const searchProduct = async (query: string) => {
    if (query.trim().length >= 3) {
      return await runAxiosAsync<{ results: SearchResult[] }>(
        authClient.get(`/product/search?name=${query}`)
      );
    }
  };

  const searchDebounce = debounce(searchProduct, 1500);

  const handleChange = async (value: string) => {
    setNotFound(false);
    setBusy(true);
    setQuery(value);
    const res = await searchDebounce(value);
    setBusy(false);
    if (res) {
      if (res.results.length) setResults(res.results);
      else setNotFound(true);
    }
  };

  const handleOnItemPress = (item: SearchResult) => {
    navigate("SingleProduct", { id: item.id });
    handleClose();
  };

  //   useEffect(() => {
  //     const keyShowEvent =
  //       Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
  //     const keyHideEvent =
  //       Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

  //     const keyShowListener = Keyboard.addListener(keyShowEvent, (event) => {
  //       setKeyboardHeight(event.endCoordinates.height);
  //     });

  //     const keyHideListener = Keyboard.addListener(keyHideEvent, (event) => {
  //       setKeyboardHeight(0);
  //     });

  //     return () => {
  //       keyShowListener.remove();
  //       keyHideListener.remove();
  //     };
  //   }, []);

  return (
    <Modal animationType="slide" onRequestClose={handleClose} visible={visible}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleClose}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={colors.primary}
            />
          </Pressable>

          <View style={styles.searchBar}>
            <SearchBar onChange={handleChange} value={query} />
          </View>
        </View>

        {/* Busy Indicator */}
        {busy ? (
          <View style={styles.busyIconContainer}>
            <View style={styles.busyAnimationSize}>
              <LottieView
                style={{ flex: 1 }}
                source={require("../../assets/loading_2.json")}
                autoPlay
                loop
              />
            </View>
          </View>
        ) : null}

        {/*Suggestions*/}
        <View style={{ paddingBottom: 60 }}>
          <FlatList
            data={!busy ? results : []}
            contentContainerStyle={styles.suggestionList}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              notFound ? (
                <EmptyView title="There are no matching products" />
              ) : null
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleOnItemPress(item)}
                style={styles.searchResultItem}
              >
                <Image
                  source={{ uri: item.thumbnail || undefined }}
                  style={styles.thumbnail}
                />
                <Text style={styles.suggestionListItem}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
    gap: 12,
  },
  header: {
    gap: size.padding,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
  },
  suggestionList: {
    gap: 10,
  },
  suggestionListItem: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 18,
  },
  searchResultItem: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 40,
    borderRadius: 5,
  },
  busyIconContainer: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
  busyAnimationSize: {
    width: 100,
    height: 100,
  },
});
