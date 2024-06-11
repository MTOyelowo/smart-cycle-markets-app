import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";
import LottieView from "lottie-react-native";

interface Props {
  onPress?(): void;
  busy?: boolean;
}

const ChatIcon: FC<Props> = ({ onPress, busy }) => {
  if (busy)
    return (
      <View style={styles.common}>
        <View style={{ flex: 1 }}>
          <LottieView
            style={{ flex: 1 }}
            source={require("../../assets/loading_2.json")}
            autoPlay
            loop
          />
        </View>
      </View>
    );

  return (
    <Pressable style={[styles.common, styles.chatButton]} onPress={onPress}>
      <AntDesign name="message1" size={20} color={colors.white} />
    </Pressable>
  );
};

export default ChatIcon;

const styles = StyleSheet.create({
  common: {
    width: 50,
    height: 50,
    bottom: 20,
    right: 20,
    position: "absolute",
  },
  chatButton: {
    borderRadius: 25,
    backgroundColor: colors.active,
    justifyContent: "center",
    alignItems: "center",
  },
});
