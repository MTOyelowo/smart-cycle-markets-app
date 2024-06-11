import { FC } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {
  asButton?: boolean;
  onPress?(): void;
  onChange?(text: string): void;
  value?: string;
}

const SearchBar: FC<Props> = ({ asButton, onPress, onChange, value }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <AntDesign name="search1" size={20} color={colors.primary} />

      {asButton ? (
        <View style={styles.textInput}>
          <Text style={styles.dummyPlaceholder}>Search here...</Text>
        </View>
      ) : (
        <TextInput
          placeholder="Search products"
          style={[styles.textInput, styles.textInputFont]}
          autoFocus
          onChangeText={onChange}
          value={value}
        />
      )}
    </Pressable>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    padding: 10,
    gap: 10,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
  },
  textInputFont: {
    color: colors.primary,
    fontSize: 18,
  },
  dummyPlaceholder: {
    color: colors.primary,
    fontSize: 18,
    opacity: 0.4,
    fontWeight: "200",
  },
});
