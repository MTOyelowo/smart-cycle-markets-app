import { FC, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "@utils/colors";
import { formatDate } from "@utils/date";

interface Props {
  title: string;
  value: Date;
  onChange(value: Date): void;
}

const isIOS = Platform.OS === "ios";

const DatePicker: FC<Props> = ({ title, value, onChange }) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const visible = isIOS ? true : showPicker;

  const onPress = () => {
    if (isIOS) return;
    setShowPicker(true);
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!isIOS ? (
        <Text style={styles.value}>
          {formatDate(value.toISOString(), "dd LLL yyyy")}
        </Text>
      ) : null}
      {visible ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          onChange={(_, date) => {
            if (date) onChange(date);
            if (!isIOS) setShowPicker(false);
          }}
        />
      ) : null}
    </Pressable>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    padding: isIOS ? 0 : 14,
    borderWidth: isIOS ? 0 : 1,
    borderColor: colors.deActive,
    borderRadius: 5,
  },
  title: {
    color: colors.primary,
  },
  value: {
    color: colors.primary,
    paddingLeft: 10,
  },
});
