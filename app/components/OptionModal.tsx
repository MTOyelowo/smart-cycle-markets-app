import colors from "@utils/colors";
import { FC } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props<T> {
  visible: boolean;
  onRequestClose(state: boolean): void;
  options: T[];
  renderItem(item: T): JSX.Element;
  onPress(item: T): void;
}

const OptionModal = <T extends unknown>({
  visible,
  options,
  renderItem,
  onPress,
  onRequestClose,
}: Props<T>) => {
  const handleItemPress = (item: T) => {
    onPress(item);
    onRequestClose(!visible);
  };
  const handleClose = () => onRequestClose(!visible);

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose}>
      <Pressable onPress={handleClose} style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView>
            {options.map((item, index) => {
              return (
                <Pressable key={index} onPress={() => handleItemPress(item)}>
                  {renderItem(item)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default OptionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: colors.backdrop,
  },
  innerContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 7,
    maxHeight: 200,
    width: "80%",
  },
});
