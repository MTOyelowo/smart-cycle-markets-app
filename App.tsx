import {
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import Navigator from "app/navigator";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import store from "app/store";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage
          position="top"
          statusBarHeight={Platform.OS === "android" ? 35 : undefined}
        />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
