import { FC } from "react";
import { StyleSheet } from "react-native";
import { LatestProduct } from "./LatestProductsList";
import GridView from "@ui/GridView";

import ProductCard from "@ui/ProductCard";

interface Props {
  data: LatestProduct[];
  onPress(item: LatestProduct): void;
}

const ProductGridView: FC<Props> = ({ data, onPress }) => {
  return (
    <GridView
      data={data}
      renderItem={(item) => <ProductCard product={item} onPress={onPress} />}
    />
  );
};

export default ProductGridView;

const styles = StyleSheet.create({});
