import AppHeader from "@components/AppHeader";
import HorizontalImageList from "@components/HorizontalImageList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@ui/BackButton";
import colors from "@utils/colors";
import size from "@utils/size";
import { ProfileStackParamList } from "app/navigator/ProfileNavigator";
import { FC, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import FormInput from "@ui/FormInput";
import DatePicker from "@ui/DatePicker";
import OptionModal from "@components/OptionModal";
import useClient from "app/hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { selectImages } from "@utils/helper";
import CategoryOptionsSelector from "@components/CategoryOptions";
import AppButton from "@ui/AppButton";
import { newProductSchema, yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import mime from "mime";
import LoadingSpinner from "@ui/LoadingSpinner";
import deepEqual from "deep-equal";

type Props = NativeStackScreenProps<ProfileStackParamList, "EditProduct">;

type ProductInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date;
};

const imageOptions = [
  { value: "Use as Thumbnail", id: "thumb" },
  { value: "Remove Image", id: "remove" },
];

const EditProduct: FC<Props> = ({ route, navigation }) => {
  const { authClient } = useClient();

  const productInfoToUpdate = {
    ...route.params.product,
    price: route.params.product.price.toString(),
    date: new Date(route.params.product.date),
  };

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showImageOptions, setShowImageOptions] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [product, setProduct] = useState({ ...productInfoToUpdate });

  const isFormChanged = deepEqual(productInfoToUpdate, product);

  const onLongPress = (image: string) => {
    setShowImageOptions(true);
    setSelectedImage(image);
  };

  const handleOnImageSelect = async () => {
    const newImages = await selectImages();
    const oldImages = product.images || [];
    const images = oldImages.concat(newImages);
    setProduct({ ...product, images: [...images] });
  };

  const removeSelectedImage = async () => {
    const notLocalImage = selectedImage?.startsWith(
      "https://res.cloudinary.com"
    );

    const images = product.images;
    const newImages = images?.filter((img) => img !== selectedImage);
    setProduct({ ...product, images: newImages });

    if (notLocalImage) {
      const splitedImageUrl = selectedImage.split("/");
      const imageId = splitedImageUrl[splitedImageUrl.length - 1].split(".")[0];
      const res = await runAxiosAsync<{ message: string }>(
        authClient.delete(`/product/image/${product.id}/${imageId}`)
      );
    }
  };

  const setAsThumbnail = () => {
    if (selectedImage.startsWith("https://res.cloudinary.com")) {
      setProduct({ ...product, thumbnail: selectedImage });
    }
  };

  const handleOnSubmit = async () => {
    // Validate inputs
    const dataToUpdate: ProductInfo = {
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      purchasingDate: product.date,
    };

    const { error } = await yupValidate(newProductSchema, dataToUpdate);
    if (error) return showMessage({ message: error, type: "danger" });

    //Initialize formData

    const formData = new FormData();

    if (product.thumbnail) {
      formData.append("thumbnail", product.thumbnail);
    }

    type productInfoKeys = keyof typeof dataToUpdate;
    for (let key in dataToUpdate) {
      const value = dataToUpdate[key as productInfoKeys];
      if (value instanceof Date) formData.append(key, value.toISOString());
      else formData.append(key, value);
    }

    //Append new/local images to formData

    product.images?.forEach((image, index) => {
      if (!image.startsWith("https://res.cloudinary.com")) {
        formData.append("images", {
          uri: image,
          name: "image_" + index,
          type: mime.getType(image) || "image/png",
        } as any);
      }
    });

    //Submit form
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.patch("/product/" + product.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  return (
    <>
      <AppHeader back={<BackButton />} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Images</Text>
          <HorizontalImageList
            images={product.images || []}
            onLongPress={onLongPress}
            style={styles.imagesList}
          />
          <Pressable onPress={handleOnImageSelect} style={styles.imageSelector}>
            <FontAwesome5 name="images" size={30} color={colors.primary} />
          </Pressable>
          <FormInput
            placeholder="Product name"
            value={product.name}
            onChangeText={(name) => setProduct({ ...product, name })}
          />
          <FormInput
            placeholder="Price"
            keyboardType="numeric"
            value={product.price.toString()}
            onChangeText={(price) => setProduct({ ...product, price })}
          />
          <DatePicker
            value={product.date}
            title="Purchasing date:"
            onChange={(date) => setProduct({ ...product, date })}
          />
          <CategoryOptionsSelector
            title={product.category || "Category"}
            onSelect={(category) => setProduct({ ...product, category })}
          />
          <FormInput
            placeholder="Description"
            value={product.description}
            onChangeText={(description) =>
              setProduct({ ...product, description })
            }
          />
          {!isFormChanged ? (
            <AppButton title="Update Product" onPress={handleOnSubmit} />
          ) : null}
        </ScrollView>
      </View>

      <OptionModal
        options={imageOptions}
        visible={showImageOptions}
        onRequestClose={setShowImageOptions}
        renderItem={(option) => {
          return <Text style={styles.option}>{option.value}</Text>;
        }}
        onPress={({ id }) => {
          if (id === "thumb") setAsThumbnail();
          if (id === "remove") removeSelectedImage();
        }}
      />
      <LoadingSpinner visible={busy} />
    </>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  imagesList: {
    gap: 5,
  },
  imageSelector: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  option: {
    paddingVertical: 10,
    color: colors.primary,
  },
});
