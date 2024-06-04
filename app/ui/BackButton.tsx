import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {}

const BackButton: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Ionicons name="chevron-back" size={18} color={colors.active} />
      <Text style={styles.title}>Go Back</Text>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  title: {
    fontSize: 18,
    color: colors.active,
  },
});
