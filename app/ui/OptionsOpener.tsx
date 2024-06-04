import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {
  visible?: boolean;
  onPress?(): void;
}

const OptionsOpener: FC<Props> = ({ onPress, visible }) => {
  if (!visible) return null;
  return (
    <Pressable onPress={onPress}>
      <Ionicons
        name="ellipsis-vertical-sharp"
        color={colors.primary}
        size={20}
      />
    </Pressable>
  );
};

export default OptionsOpener;

const styles = StyleSheet.create({
  container: {},
});
