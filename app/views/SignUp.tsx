import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyboardAvoidingView from "@ui/CustomKeyboardAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import colors from "@utils/colors";
import { newUserSchema, yupValidate } from "@utils/validator";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useAuth, { SignInResponse } from "app/hooks/useAuth";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}

const SignUp: FC<Props> = () => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();

  const [busy, setBusy] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (inputField: string) => {
    return (text: string) => {
      setUserInfo({ ...userInfo, [inputField]: text });
    };
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);

    if (error) return showMessage({ message: error, type: "danger" });

    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/sign-up", values)
    );

    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
      signIn(values!);
    }
    setBusy(false);
  };

  const { name, email, password } = userInfo;
  return (
    <CustomKeyboardAvoidingView>
      <View style={styles.container}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <FormInput
            placeholder="Name"
            value={name}
            onChangeText={handleChange("name")}
          />
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
          <AppButton title="Sign Up" onPress={handleSubmit} active={!busy} />

          <FormDivider />
          <FormNavigator
            onLeftPress={() => navigate("ForgotPassword")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Forget Password"
            rightTitle="Sign In"
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

export default SignUp;
