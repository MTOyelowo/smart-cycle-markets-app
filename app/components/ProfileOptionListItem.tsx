import { FC } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { AntDesign, createIconSet } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {
  antIconName: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
  onPress?(): void;
}

const ProfileOptionListItem: FC<Props> = ({
  antIconName,
  title,
  style,
  active,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={styles.buttonContainer}>
        <AntDesign
          name={antIconName as any}
          size={24}
          color={active ? colors.active : colors.primary}
        />
        <Text
          style={[
            styles.title,
            { color: active ? colors.active : colors.primary },
          ]}
        >
          {title}
        </Text>
      </View>

      {active ? <View style={styles.indicator} /> : null}
    </Pressable>
  );
};

export default ProfileOptionListItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
  },
  indicator: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 5,
    backgroundColor: colors.active,
  },
});
