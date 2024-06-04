import { StyleSheet, Text, View } from "react-native";
import { FC } from "react";
import ChatNotification from "@ui/ChatNotification";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "app/navigator/AppNavigator";

interface Props {}

const Home: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

  return (
    <>
      <ChatNotification onPress={() => navigate("Chats")} />
      <View>
        <Text>Home</Text>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({});
