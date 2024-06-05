import AppHeader from "@components/AppHeader";
import { LatestProduct } from "@components/LatestProductsList";
import ProductGridView from "@components/ProductGridView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@ui/BackButton";
import EmptyView from "@ui/EmptyView";
import ProductCard from "@ui/ProductCard";
import colors from "@utils/colors";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AppStackParamList } from "app/navigator/AppNavigator";
import { FC, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Props = NativeStackScreenProps<AppStackParamList, "ProductsList">;

const cols = 2;

const ProductsList: FC<Props> = ({ route, navigation }) => {
  const { authClient } = useClient();
  const { category } = route.params;

  const [products, setProducts] = useState<LatestProduct[]>([]);

  const isOdd = products.length % cols !== 0;

  const fetchProducts = async (category: string) => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get(`/product/by-category/${category}`)
    );

    if (res) {
      setProducts(res.products);
    }
  };

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

  if (products.length === 0)
    return (
      <>
        <AppHeader
          back={<BackButton />}
          center={<Text style={styles.title}>{category}</Text>}
        />
        <View style={styles.container}>
          <EmptyView title="Sorry, there are no products in selected category" />
        </View>
      </>
    );

  return (
    <>
      <AppHeader
        back={<BackButton />}
        center={<Text style={styles.title}>{category}</Text>}
      />
      <View style={styles.container}>
        <FlatList
          numColumns={cols}
          data={products}
          renderItem={({ item, index }) => (
            <View style={{ flex: isOdd && products.length - 1 ? 1 / cols : 1 }}>
              <ProductCard
                product={item}
                onPress={({ id }) =>
                  navigation.navigate("SingleProduct", { id })
                }
              />
            </View>
          )}
        />
      </View>
    </>
  );
};

export default ProductsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: size.padding,
    gap: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
});
