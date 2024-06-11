import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import AvatarView from "./AvatarView";
import colors from "@utils/colors";

interface Props {
  name: string;
  avatar?: string;
}

const PeerProfile: FC<Props> = ({ avatar, name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <AvatarView size={35} uri={avatar} />
    </View>
  );
};

export default PeerProfile;

const styles = StyleSheet.create({
  container: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
    color: colors.primary,
  },
});
