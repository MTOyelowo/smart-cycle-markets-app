import AvatarView from "@ui/AvatarView";
import colors from "@utils/colors";
import { formatDate } from "@utils/date";
import { formatPrice } from "@utils/helper";
import { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ImageSlider from "./ImageSlider";
import { Product } from "app/store/listings";

interface Props {
  product: Product;
}

const ProductDetails: FC<Props> = ({ product }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{}}>
        <ImageSlider images={product.images} />
        <View style={styles.detailsContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.date}>
            Purchase date: {formatDate(product.date, "dd LLL yyyy")}
          </Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.profileContainer}>
            <AvatarView uri={product.seller.avatar} size={60} />
            <Text style={styles.profileName}>{product.seller.name}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  detailsContainer: { gap: 5 },
  category: {
    color: colors.primary,
    fontWeight: "700",
  },
  price: {
    color: colors.active,
    fontWeight: "700",
    fontSize: 20,
  },
  date: {
    color: colors.active,
    fontWeight: "700",
  },
  name: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
    marginTop: 5,
  },
  description: {
    color: colors.primary,
    letterSpacing: 0.5,
    marginTop: 5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  profileName: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 20,
    letterSpacing: 0.5,
  },
});
