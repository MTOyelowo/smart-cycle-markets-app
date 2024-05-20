import { Modal, StyleSheet, Text, View } from "react-native";
import { FC } from "react";
import colors from "@utils/colors";
import LottieView from "lottie-react-native";

interface Props {
  visible: boolean;
}

const LoadingSpinner: FC<Props> = ({ visible }) => {
  if (!visible) return null;
  return (
    <Modal animationType="fade" transparent>
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={{ flex: 1, transform: [{ scale: 0.4 }] }}
        />
      </View>
    </Modal>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backdrop,
  },
});
