import { StyleSheet } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import colors from "@utils/colors";
import { FC, useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import { useDispatch } from "react-redux";
import { Profile, updateAuthState } from "app/store/auth";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import LoadingSpinner from "@ui/LoadingSpinner";
import useAuth from "app/hooks/useAuth";
import TabNavigator from "./TabNavigator";
import useClient from "app/hooks/useClient";
import asyncStorage, { Keys } from "@utils/asyncStorage";

interface Props {}

const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

const Navigator: FC<Props> = () => {
  const dispatch = useDispatch();

  const { loggedIn, authState } = useAuth();
  const { authClient } = useClient();
  const fetchAuthState = async () => {
    const token = await asyncStorage.get(Keys.AUTH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<{ profile: Profile }>(
        authClient.get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      );

      if (res) {
        dispatch(updateAuthState({ pending: false, profile: res.profile }));
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  return (
    <NavigationContainer theme={myTheme}>
      <LoadingSpinner visible={authState.pending} />
      {!loggedIn ? <AuthNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
};

export default Navigator;

const styles = StyleSheet.create({});
