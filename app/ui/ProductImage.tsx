import size from "@utils/size";
import { FC } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

interface Props {
  uri?: string;
}

const { width } = Dimensions.get("screen");
const imageWidth = width - size.padding * 2;
const aspect = 16 / 9;

const ProductImage: FC<Props> = ({ uri }) => {
  return (
    <Image
      source={{ uri }}
      style={styles.image}
      resizeMethod="resize"
      resizeMode="cover"
    />
  );
};

export default ProductImage;

const styles = StyleSheet.create({
  image: {
    width: imageWidth,
    height: imageWidth / aspect,
    borderRadius: 7,
  },
});
