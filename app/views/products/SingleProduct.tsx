import { FC, useState } from "react";

import AppHeader from "@components/AppHeader";
import ProductDetails from "@components/ProductDetails";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@ui/BackButton";
import size from "@utils/size";
import useAuth from "app/hooks/useAuth";
import { ProfileStackParamList } from "app/navigator/ProfileNavigator";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";
import OptionsOpener from "@ui/OptionsOpener";
import OptionModal from "@components/OptionModal";
import useClient from "app/hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import LoadingSpinner from "@ui/LoadingSpinner";
import { useDispatch } from "react-redux";
import { deleteItem } from "app/store/listings";

type Props = NativeStackScreenProps<ProfileStackParamList, "SingleProduct">;

const SingleProduct: FC<Props> = ({ route, navigation }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  const { authState } = useAuth();
  const { authClient } = useClient();
  const dispatch = useDispatch();

  const { product } = route.params;

  const isOwner = authState.profile?.id === product?.seller.id;

  const menuOptions = [
    {
      name: "Edit",
      icon: <Feather name="edit" size={20} color={colors.primary} />,
    },
    {
      name: "Delete",
      icon: <Feather name="trash-2" size={20} color={colors.primary} />,
    },
  ];

  const confirmDelete = async () => {
    const id = product?.id;
    if (!id) return;
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.delete("/product/" + id)
    );
    setBusy(false);

    if (res?.message) {
      dispatch(deleteItem(id));
      showMessage({ message: res.message, type: "success" });
      navigation.navigate("Listings");
    }
  };

  const onDeletePress = () => {
    Alert.alert(
      "Are you sure?",
      "This action will remove this product permanantly",
      [
        { text: "Delete", style: "destructive", onPress: confirmDelete },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <>
      <AppHeader
        back={<BackButton />}
        right={
          <OptionsOpener
            visible={isOwner}
            onPress={() => setShowOptions(true)}
          />
        }
      />
      <View style={styles.container}>
        {product ? <ProductDetails product={product} /> : null}
        <Pressable
          style={styles.chatButton}
          onPress={() => navigation.navigate("ChatWindow")}
        >
          <AntDesign name="message1" size={20} color={colors.white} />
        </Pressable>
      </View>
      <OptionModal
        options={menuOptions}
        renderItem={({ icon, name }) => (
          <View style={styles.optionItem}>
            {icon}
            <Text style={styles.optionsTitle}>{name}</Text>
          </View>
        )}
        visible={showOptions}
        onRequestClose={setShowOptions}
        onPress={(option) => {
          if (option.name === "Delete") {
            onDeletePress();
          }
          if (option.name === "Edit") {
            navigation.navigate("EditProduct", { product: product! });
          }
        }}
      />
      <LoadingSpinner visible={busy} />
    </>
  );
};
export default SingleProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 6,
  },
  optionsTitle: {
    color: colors.primary,
  },
  chatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.active,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
