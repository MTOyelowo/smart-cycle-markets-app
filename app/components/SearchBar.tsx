import { FC } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {}

const SearchBar: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <AntDesign name="search1" size={20} color={colors.primary} />
      <TextInput placeholder="Search products" style={styles.textInput} />
    </View>
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
    color: colors.primary,
    fontSize: 18,
  },
});
