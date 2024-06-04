import OptionsSelector from "@ui/OptionsSelector";
import { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import OptionModal from "./OptionModal";
import categories from "@utils/categories";
import CategoryOptions from "@ui/CategoryOptions";

interface Props {
  title: string;
  onSelect(category: string): void;
}

const CategoryOptionsSelector: FC<Props> = ({ title, onSelect }) => {
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <OptionsSelector
        title={title}
        onPress={() => setShowCategoryModal(true)}
      />
      <OptionModal
        visible={showCategoryModal}
        onRequestClose={setShowCategoryModal}
        options={categories}
        renderItem={(item) => {
          return <CategoryOptions name={item.name} icon={item.icon} />;
        }}
        onPress={(item) => onSelect(item.name)}
      />
    </View>
  );
};

export default CategoryOptionsSelector;

const styles = StyleSheet.create({
  container: {},
});
