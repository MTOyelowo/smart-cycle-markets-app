import { StyleSheet, View } from "react-native";

interface Props<T> {
  data: T[];
  cols?: number;
  renderItem(item: T): JSX.Element;
}

const GridView = <T extends unknown>(props: Props<T>) => {
  const { data, cols = 2, renderItem } = props;
  return (
    <View style={styles.container}>
      {data.map((product, index) => {
        return (
          <View key={index} style={{ width: `${100 / cols}%` }}>
            {renderItem(product)}
          </View>
        );
      })}
    </View>
  );
};

export default GridView;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});
