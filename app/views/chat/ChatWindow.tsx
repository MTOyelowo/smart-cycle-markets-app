import AppHeader from "@components/AppHeader";
import BackButton from "@ui/BackButton";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {}

const ChatWindow: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <AppHeader back={<BackButton />} />
    </View>
  );
};

export default ChatWindow;

const styles = StyleSheet.create({
  container: {},
});
