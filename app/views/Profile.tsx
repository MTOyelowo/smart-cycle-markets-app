import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FC, useState } from "react";
import AvatarView from "@ui/AvatarView";
import useAuth from "app/hooks/useAuth";
import colors from "@utils/colors";
import size from "@utils/size";
import FormDivider from "@ui/FormDivider";
import ProfileOptionListItem from "@components/ProfileOptionListItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileStackParamList } from "app/navigator/ProfileNavigator";
import { AntDesign } from "@expo/vector-icons";
import useClient from "app/hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { ProfileRes } from "app/navigator";
import { useDispatch } from "react-redux";
import { updateAuthState } from "app/store/auth";
import { showMessage } from "react-native-flash-message";
import { selectImages } from "@utils/helper";
import mime from "mime";
import LoadingSpinner from "@ui/LoadingSpinner";

interface Props {}

const Profile: FC<Props> = (props) => {
  const { authState, signOut } = useAuth();
  const { profile } = authState;
  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  const { authClient } = useClient();
  const dispatch = useDispatch();

  const [userName, setUserName] = useState<string>(profile?.name || "");
  const [busy, setBusy] = useState<boolean>(false);
  const [updatingAvatar, setUpdatingAvatar] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const isNameChanged =
    profile?.name !== userName && userName.trim().length >= 3;

  const onMessagePress = () => {
    navigate("Chats");
  };

  const onListingsPress = () => {
    navigate("Listings");
  };

  const handleProfileImageSelection = async () => {
    const [image] = await selectImages({
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (image) {
      const formData = new FormData();
      formData.append("avatar", {
        name: "Avatar",
        uri: image,
        type: mime.getType(image),
      } as any);
      setUpdatingAvatar(true);
      const res = await runAxiosAsync<ProfileRes>(
        authClient.patch("/auth/update-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      );
      setUpdatingAvatar(false);
      if (res) {
        dispatch(
          updateAuthState({
            profile: { ...profile!, ...res.profile },
            pending: false,
          })
        );
      }
    }
  };

  const updateProfile = async () => {
    const res = await runAxiosAsync<{ profile: ProfileRes }>(
      authClient.patch("/auth/update-profile", { name: userName })
    );

    if (res) {
      showMessage({ message: "Name updated successfully", type: "success" });
      dispatch(
        updateAuthState({
          pending: false,
          profile: { ...profile!, ...res.profile },
        })
      );
    }
  };

  const getVerificationToken = async () => {
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.get("/auth/verify-token")
    );
    setBusy(false);

    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  const fetchProfile = async () => {
    setRefreshing(true);
    const res = await runAxiosAsync<{ profile: ProfileRes }>(
      authClient("/auth/profile")
    );
    setRefreshing(false);

    if (res) {
      dispatch(
        updateAuthState({
          profile: { ...profile!, ...res.profile },
          pending: false,
        })
      );
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchProfile} />
      }
      contentContainerStyle={styles.container}
    >
      {!profile?.verified ? (
        <View style={styles.verificationLinkContainer}>
          <Text style={styles.verificationTitle}>
            Seems your account has not been verified yet
          </Text>
          {busy ? (
            <Text style={styles.verificationLink}>Please wait...</Text>
          ) : (
            <Text
              onPress={getVerificationToken}
              style={styles.verificationLink}
            >
              Tap here to get the link
            </Text>
          )}
        </View>
      ) : null}
      <View style={styles.profileContainer}>
        <AvatarView
          size={80}
          uri={profile?.avatar}
          onPress={handleProfileImageSelection}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.nameContainer}>
            <TextInput
              value={userName}
              onChangeText={(text) => setUserName(text)}
              style={styles.name}
            />
            {isNameChanged ? (
              <Pressable onPress={updateProfile}>
                <AntDesign name="check" size={24} color={colors.primary} />
              </Pressable>
            ) : null}
          </View>
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
      <LoadingSpinner visible={updatingAvatar} />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
  verificationLinkContainer: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: colors.deActive,
    gap: 5,
  },
  verificationTitle: {
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  verificationLink: {
    fontWeight: "600",
    color: colors.active,
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
