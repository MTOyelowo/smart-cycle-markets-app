import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FC } from "react";
import AvatarView from "@ui/AvatarView";
import useAuth from "app/hooks/useAuth";
import colors from "@utils/colors";
import size from "@utils/size";
import FormDivider from "@ui/FormDivider";
import ProfileOptionListItem from "@components/ProfileOptionListItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileStackParamList } from "app/navigator/ProfileNavigator";

interface Props {}

const Profile: FC<Props> = (props) => {
  const { authState, signOut } = useAuth();
  const { profile } = authState;
  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  const onMessagePress = () => {
    navigate("Chats");
  };

  const onListingsPress = () => {
    navigate("Listings");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <AvatarView size={80} uri={profile?.avatar} />
        <View>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>

      <FormDivider />

      <ProfileOptionListItem
        antIconName="message1"
        title="Messages"
        style={styles.marginBottom}
        onPress={onMessagePress}
      />
      <ProfileOptionListItem
        antIconName="appstore-o"
        title="Your Listings"
        style={styles.marginBottom}
        onPress={onListingsPress}
      />
      <ProfileOptionListItem
        antIconName="logout"
        title="Log out"
        onPress={signOut}
      />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: colors.primary,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  marginBottom: {
    marginBottom: 15,
  },
});
