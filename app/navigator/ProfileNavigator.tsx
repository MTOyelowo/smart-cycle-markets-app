import { StyleSheet } from "react-native";
import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@views/Profile";

interface Props {}

export type ProfileStackParamList = {
  Profile: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({});
