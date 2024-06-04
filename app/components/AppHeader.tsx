import { useNavigation } from "@react-navigation/native";
import size from "@utils/size";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  back?: JSX.Element | null;
  center?: JSX.Element | null;
  right?: JSX.Element | null;
}

const AppHeader: FC<Props> = ({ back, right, center }) => {
  const { goBack, canGoBack } = useNavigation();
  return (
    <View style={styles.container}>
      {/* Left button */}
      {canGoBack() ? <Pressable onPress={goBack}>{back}</Pressable> : null}
      {/* Center button */}
      {center}
      {/* Right button */}
      {right}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: size.padding,
  },
});
