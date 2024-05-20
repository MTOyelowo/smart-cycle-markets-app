import { Pressable, StyleSheet, Text, View } from "react-native";
import { FC } from "react";
import colors from "@utils/colors";

interface Props {
  title: string;
  active?: boolean;
  onPress?(): void;
}

const AppButton: FC<Props> = ({ title, active = true, onPress }) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={[styles.container, active ? styles.btnActive : styles.btnDeActive]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 5,
    alignItems: "center",
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  btnDeActive: {
    backgroundColor: colors.deActive,
  },
  title: {
    color: colors.white,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
