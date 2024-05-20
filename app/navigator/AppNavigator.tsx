import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/Home";

interface Props {}

export type AppStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
