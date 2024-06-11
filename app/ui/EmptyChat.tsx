import colors from "@utils/colors";
import size from "@utils/size";
import { FC } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface Props {}

const EmptyChat: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Breaking the ice can be the hardest part, but trust me, it's worth it!
          Start wit a simple 'hello' and watch the conversation unfold
        </Text>
      </View>
    </View>
  );
};

export default EmptyChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: size.padding,
    transform: [
      { rotate: "180deg" },
      { rotateY: Platform.OS === "ios" ? "-180deg" : "-0deg" },
    ],
  },
  titleContainer: {
    backgroundColor: colors.deActive,
    padding: size.padding,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.active,
  },
});
