import colors from "@utils/colors";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import ProductGridView from "./ProductGridView";

export type LatestProduct = {
  id: string;
  name: string;
  thumbnail?: string;
  category: string;
  price: number;
};

interface Props {
  data: LatestProduct[];
  onPress(product: LatestProduct): void;
}

const LatestProductsList: FC<Props> = ({ data, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recently Listed Products</Text>
      <ProductGridView data={data} onPress={onPress} />
    </View>
  );
};

export default LatestProductsList;

const styles = StyleSheet.create({
  container: {},
  header: {
    fontWeight: "600",
    color: colors.primary,
    fontSize: 20,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
});
