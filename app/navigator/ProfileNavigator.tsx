import { StyleSheet } from "react-native";
import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@views/Profile";
import Chats from "@views/Chats";
import Listings from "@views/products/Listings";
import SingleProduct from "@views/products/SingleProduct";
import { Product } from "app/store/listings";
import ChatWindow from "@views/chat/ChatWindow";
import EditProduct from "@views/products/EditProduct";

interface Props {}

export type ProfileStackParamList = {
  Profile: undefined;
  Chats: undefined;
  Listings: undefined;
  SingleProduct: { product?: Product; id?: string };
  EditProduct: { product: Product };
  ChatWindow: {
    conversationId: string;
    peerProfile: { id: string; name: string; avatar?: string };
  };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Listings" component={Listings} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="ChatWindow" component={ChatWindow} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({});
