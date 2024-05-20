import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useState } from "react";
import FormInput from "@ui/FormInput";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";
import DatePicker from "@ui/DatePicker";
import OptionModal from "@components/OptionModal";
import categories from "@utils/categories";
import CategoryOptions from "@ui/CategoryOptions";
import AppButton from "@ui/AppButton";
import CustomKeyboardAvoidingView from "@ui/CustomKeyboardAvoidingView";

interface Props {}

const NewListing: FC<Props> = (props) => {
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  return (
    <CustomKeyboardAvoidingView>
      <View style={styles.container}>
        <Pressable style={styles.fileSelector}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="images" size={24} color="black" />
          </View>
          <Text style={styles.btnTitle}>Add Images</Text>
        </Pressable>
        <FormInput placeholder="Product name" />
        <FormInput placeholder="Price" />
        <DatePicker
          title="Purchasing Date: "
          value={new Date()}
          onChange={() => {}}
        />
        <Pressable
          style={styles.categoryButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryTitle}>Category</Text>
          <AntDesign name="caretdown" color={colors.primary} />
        </Pressable>
        <FormInput placeholder="Description" multiline />
        <AppButton title="List Product" />

        <OptionModal
          visible={showCategoryModal}
          onRequestClose={setShowCategoryModal}
          options={categories}
          renderItem={(item) => {
            return <CategoryOptions name={item.name} icon={item.icon} />;
          }}
          onPress={(item) => {
            console.log(item);
          }}
        />
      </View>
    </CustomKeyboardAvoidingView>
  );
};

export default NewListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  fileSelector: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },
  btnTitle: {
    color: colors.primary,
    marginTop: 5,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5,
  },
  categoryTitle: {
    color: colors.primary,
  },
});
