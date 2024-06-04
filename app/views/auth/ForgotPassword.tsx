import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyboardAvoidingView from "@ui/CustomKeyboardAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import colors from "@utils/colors";
import { forgetPasswordSchema, yupValidate } from "@utils/validator";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";

import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {}

const ForgotPassword: FC<Props> = () => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(forgetPasswordSchema, {
      email,
    });
    if (error) return showMessage({ message: error, type: "danger" });

    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("auth/forgot-password", { email })
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

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
            onChangeText={(text) => setEmail(text)}
          />
          <AppButton
            active={!busy}
            title={busy ? "Please wait..." : "Request link"}
            onPress={handleSubmit}
          />
          <FormDivider />
          <FormNavigator
            onLeftPress={() => navigate("SignUp")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Sign Up"
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

export default ForgotPassword;
