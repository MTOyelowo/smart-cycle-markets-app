import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/Home";
import Chats from "@views/Chats";

interface Props {}

export type AppStackParamList = {
  Home: undefined;
  Chats: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chats" component={Chats} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
