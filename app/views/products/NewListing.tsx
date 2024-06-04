import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import FormInput from "@ui/FormInput";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";
import DatePicker from "@ui/DatePicker";
import OptionModal from "@components/OptionModal";
import categories from "@utils/categories";
import CategoryOptions from "@ui/CategoryOptions";
import AppButton from "@ui/AppButton";
import CustomKeyboardAvoidingView from "@ui/CustomKeyboardAvoidingView";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import HorizontalImageList from "@components/HorizontalImageList";
import { newProductSchema, yupValidate } from "@utils/validator";
import mime from "mime";
import useClient from "app/hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import LoadingSpinner from "@ui/LoadingSpinner";
import OptionsSelector from "@ui/OptionsSelector";
import { selectImages } from "@utils/helper";
import CategoryOptionsSelector from "@components/CategoryOptions";

interface Props {}

const defaultInfo = {
  name: "",
  description: "",
  price: "",
  category: "",
  purchasingDate: new Date(),
};

const imageOptions = [{ value: "Remove Image", id: "remove" }];

const NewListing: FC<Props> = (props) => {
  const { authClient } = useClient();

  const [productInfo, setProductInfo] = useState({ ...defaultInfo });
  const [images, setImages] = useState<string[] | []>([]);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showImageOptions, setShowImageOptions] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [busy, setBusy] = useState<boolean>(false);

  const { name, price, category, description, purchasingDate } = productInfo;

  const handleChange = (inputField: string) => {
    return (text: string) => {
      setProductInfo({ ...productInfo, [inputField]: text });
    };
  };

  const handleSubmit = async () => {
    const { error } = await yupValidate(newProductSchema, productInfo);
    if (error) return showMessage({ message: error, type: "danger" });

    setBusy(true);

    const formData = new FormData();

    type productInfoKeys = keyof typeof productInfo;

    for (let key in productInfo) {
      const value = productInfo[key as productInfoKeys];
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    }

    const newImages = images.map((image, index) => ({
      name: "image_" + index,
      type: mime.getType(image),
      uri: image,
    }));

    for (let image of newImages) {
      formData.append("images", image as any);
    }

    const res = await runAxiosAsync<{ message: string }>(
      authClient.post("/product/list", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    setBusy(false);

    if (res) {
      showMessage({ message: res.message, type: "success" });
      setProductInfo({ ...defaultInfo });
      setImages([]);
    }
  };

  const handleImageSelection = async () => {
    const newImages = await selectImages();
    setImages([...images, ...newImages]);
  };

  return (
    <CustomKeyboardAvoidingView>
      <View style={styles.container}>
        <View style={styles.imagesContainer}>
          <Pressable onPress={handleImageSelection} style={styles.fileSelector}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="images" size={24} color="black" />
            </View>
            <Text style={styles.btnTitle}>Add Images</Text>
          </Pressable>
          <HorizontalImageList
            images={images}
            style={styles.imagesList}
            onLongPress={(image) => {
              setSelectedImage(image);
              setShowImageOptions(true);
            }}
          />
        </View>
        <FormInput
          value={name}
          placeholder="Product name"
          onChangeText={handleChange("name")}
        />
        <FormInput
          value={price}
          placeholder="Price"
          onChangeText={handleChange("price")}
          keyboardType="numeric"
        />
        <DatePicker
          title="Purchasing Date: "
          value={purchasingDate}
          onChange={(purchasingDate) =>
            setProductInfo({ ...productInfo, purchasingDate })
          }
        />
        <CategoryOptionsSelector
          title={category || "Category"}
          onSelect={handleChange("category")}
        />

        {/* <OptionsSelector
          title={category || "Category"}
          onPress={() => setShowCategoryModal(true)}
        /> */}
        <FormInput
          value={description}
          placeholder="Description"
          multiline
          onChangeText={handleChange("description")}
        />
        <AppButton title="List Product" onPress={handleSubmit} active={!busy} />

        {/* Category options */}
        {/* <OptionModal
          visible={showCategoryModal}
          onRequestClose={setShowCategoryModal}
          options={categories}
          renderItem={(item) => {
            return <CategoryOptions name={item.name} icon={item.icon} />;
          }}
          onPress={(item) =>
            setProductInfo({ ...productInfo, category: item.name })
          }
        /> */}

        {/* Image action options */}
        <OptionModal
          visible={showImageOptions}
          onRequestClose={setShowImageOptions}
          options={imageOptions}
          renderItem={(item) => {
            return <Text style={styles.imageOptions}>{item.value}</Text>;
          }}
          onPress={(option) => {
            if (option.id === "remove") {
              const newImages = images.filter(
                (image) => image !== selectedImage
              );
              setImages([...newImages]);
            }
          }}
        />

        <LoadingSpinner visible={busy} />
      </View>
    </CustomKeyboardAvoidingView>
  );
};

export default NewListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 10,
  },
  fileSelector: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  imagesList: {
    gap: 5,
  },
  imageOptions: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.primary,
    padding: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },
  btnTitle: {
    color: colors.primary,
    marginTop: 5,
  },
});
