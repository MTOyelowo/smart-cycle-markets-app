import colors from "@utils/colors";
import size from "@utils/size";
import { FC } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface Props {}

const { width } = Dimensions.get("screen");
const containerWidth = width - size.padding * 2;
const aspect = 16 / 9;

const DefaultProductImage: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Entypo name="images" size={containerWidth * 0.4} color="whitesmoke" />
    </View>
  );
};

export default DefaultProductImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deActive,
    width: containerWidth,
    height: containerWidth / aspect,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
});
