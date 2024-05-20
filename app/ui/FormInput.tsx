import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { FC, useState } from "react";
import colors from "@utils/colors";

interface Props extends TextInputProps {}

const FormInput: FC<Props> = (props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  return (
    <TextInput
      style={[
        styles.input,
        isFocused ? styles.borderActive : styles.borderDeActive,
      ]}
      {...props}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    />
  );
};

export default FormInput;

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    marginBottom: 15,
  },
  borderDeActive: {
    borderWidth: 1,
    borderColor: colors.deActive,
  },
  borderActive: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
