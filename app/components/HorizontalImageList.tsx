import { FC } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  images: string[];
  onPress?(item: string): void;
  onLongPress?(item: string): void;
  style?: StyleProp<ViewStyle>;
}

const HorizontalImageList: FC<Props> = ({
  images,
  style,
  onPress,
  onLongPress,
}) => {
  return (
    <FlatList
      data={images}
      renderItem={({ item }) => {
        return (
          <Pressable
            style={styles.listItem}
            onPress={() => onPress && onPress(item)}
            onLongPress={() => onLongPress && onLongPress(item)}
          >
            <Image style={styles.image} source={{ uri: item }} />
          </Pressable>
        );
      }}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={style}
    />
  );
};

export default HorizontalImageList;

const styles = StyleSheet.create({
  container: {},
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
});
