import { LatestProduct } from "@components/LatestProductsList";
import colors from "@utils/colors";
import { formatPrice } from "@utils/helper";
import { FC } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  product: LatestProduct;
  onPress(product: LatestProduct): void;
}

const ProductCard: FC<Props> = ({ product, onPress }) => {
  return (
    <Pressable onPress={() => onPress(product)} style={styles.productContainer}>
      {product.thumbnail ? (
        <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.noImageView]}>
          <MaterialCommunityIcons
            name="image-off"
            size={40}
            color={colors.backdrop}
          />
        </View>
      )}
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <Text style={styles.name}>{product.name}</Text>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {},
  productContainer: {
    padding: 7,
  },
  thumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 5,
  },
  noImageView: {
    backgroundColor: colors.deActive,
    alignItems: "center",
    justifyContent: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.active,
    paddingTop: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
});
