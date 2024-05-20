import colors from "@utils/colors";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  icon?: JSX.Element;
  name: string;
}

const CategoryOptions: FC<Props> = ({ icon, name }) => {
  return (
    <View style={styles.optionItem}>
      <View style={styles.svg}>{icon}</View>
      <Text style={styles.category}>{name}</Text>
    </View>
  );
};

export default CategoryOptions;

const styles = StyleSheet.create({
  category: {
    color: colors.primary,
    paddingVertical: 10,
  },

  optionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  svg: {
    transform: [{ scale: 0.4 }],
  },
});
