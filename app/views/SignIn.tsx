import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyboardAvoidingView from "@ui/CustomKeyboardAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import colors from "@utils/colors";
import { userSignInSchema, yupValidate } from "@utils/validator";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { updateAuthState } from "app/store/auth";
import axios from "axios";

import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";

interface Props {}

const SignIn: FC<Props> = () => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (inputField: string) => {
    return (text: string) => {
      setUserInfo({ ...userInfo, [inputField]: text });
    };
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(userSignInSchema, userInfo);

    if (error) return showMessage({ message: error, type: "danger" });

    if (values) {
      signIn(values);
    }
  };

  const { email, password } = userInfo;

  return (
    <CustomKeyboardAvoidingView>
      <View style={styles.container}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleChange("email")}
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />
          <AppButton title="Sign In" onPress={handleSubmit} />
          <FormDivider />
          <FormNavigator
            onLeftPress={() => navigate("ForgotPassword")}
            onRightPress={() => navigate("SignUp")}
            leftTitle="Forget Password"
            rightTitle="Sign Up"
          />
        </View>
      </View>
    </CustomKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  input: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 8,
    borderRadius: 5,
    marginBottom: 15,
    color: colors.primary,
  },
  formContainer: {
    marginTop: 15,
  },
});

export default SignIn;
