import colors from "@utils/colors";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  onPress?(): void;
  title: string;
}

const OptionsSelector: FC<Props> = ({ onPress, title }) => {
  return (
    <Pressable style={styles.categoryButton} onPress={onPress}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <AntDesign name="caretdown" color={colors.primary} />
    </Pressable>
  );
};

export default OptionsSelector;

const styles = StyleSheet.create({
  container: {},
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5,
  },
  categoryTitle: {
    color: colors.primary,
  },
});
