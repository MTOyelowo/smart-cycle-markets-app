import categories from "@utils/categories";
import colors from "@utils/colors";
import { FC } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  onPress(category: string): void;
}

const LIST_ITEM_SIZE = 80;

const CategoriesList: FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => onPress(item.name)}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text numberOfLines={2} style={styles.categoryName}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default CategoriesList;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  listItem: {
    width: LIST_ITEM_SIZE,
  },
  iconContainer: {
    width: LIST_ITEM_SIZE,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    paddingTop: 2,
    color: colors.primary,
  },
});
