import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CustomKeyboardAvoidingView: FC<Props> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>{children}</ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardAvoidingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
