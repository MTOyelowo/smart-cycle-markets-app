import AppHeader from "@components/AppHeader";
import BackButton from "@ui/BackButton";
import DefaultProductImage from "@ui/DefaultProductImage";
import ProductImage from "@ui/ProductImage";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { FC, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileStackParamList } from "app/navigator/ProfileNavigator";
import { Product, getListings, updateListings } from "app/store/listings";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

type ListingResponse = {
  products: Product[];
};

const Listings: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { authClient } = useClient();
  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  const listings = useSelector(getListings);

  const [fetching, setFetching] = useState<boolean>(false);

  const fetchListings = async () => {
    setFetching(true);
    const res = await runAxiosAsync<ListingResponse>(
      authClient.get("/product/listings")
    );
    setFetching(false);

    if (res) {
      dispatch(updateListings(res.products));
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <AppHeader back={<BackButton />} />
      <View style={styles.container}>
        <FlatList
          onRefresh={fetchListings}
          refreshing={fetching}
          contentContainerStyle={styles.listContainer}
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => navigate("SingleProduct", { product: item })}
                style={styles.itemContainer}
              >
                {item.thumbnail ? (
                  <ProductImage uri={item.thumbnail} />
                ) : (
                  <DefaultProductImage />
                )}
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </>
  );
};

export default Listings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  listContainer: {
    paddingBottom: 20,
    gap: 20,
  },
  itemContainer: {
    gap: 7,
  },
  productName: {
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
  },
});
