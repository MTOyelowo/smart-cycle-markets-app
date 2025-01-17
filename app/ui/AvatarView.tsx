import { FC } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {
  uri?: string;
  size?: number;
  onPress?(): void;
}

const iconContainerFactor = 0.7;
const iconSizeFactor = 0.8;

const AvatarView: FC<Props> = ({ size = 50, uri, onPress }) => {
  const iconContainerSize = size * iconContainerFactor;
  const iconSize = size * iconSizeFactor;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { width: size, aspectRatio: 1, borderRadius: size / 2 },
        !uri && styles.profileIcon,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View
          style={[
            {
              width: iconContainerSize,
              aspectRatio: 1,
              borderRadius: iconContainerSize / 2,
            },
            styles.iconContainer,
          ]}
        >
          <FontAwesome name="user" size={iconSize} color={colors.white} />
        </View>
      )}
    </Pressable>
  );
};

export default AvatarView;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
  iconContainer: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
