import colors from "@utils/colors";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
}

const EmptyView: FC<Props> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default EmptyView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.backdrop,
  },
});
