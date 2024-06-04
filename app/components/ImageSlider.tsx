import ProductImage from "@ui/ProductImage";
import colors from "@utils/colors";
import { FC, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, ViewToken } from "react-native";

interface Props {
  images?: string[];
}

const ImageSlider: FC<Props> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const viewableConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const onViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      setActiveIndex(info.viewableItems[0].index || 0);
    }
  );

  if (!images?.length) return null;
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={images}
        renderItem={({ item }) => {
          return <ProductImage uri={item} />;
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        viewabilityConfig={viewableConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
      <View style={styles.indicator}>
        <Text style={styles.indicatorText}>
          {activeIndex + 1}/{images?.length}
        </Text>
      </View>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  container: {},
  flatList: { position: "relative" },
  indicator: {
    position: "absolute",
    width: 35,
    height: 25,
    backgroundColor: colors.backdrop,
    bottom: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  indicatorText: {
    color: colors.white,
    fontWeight: "600",
  },
});
