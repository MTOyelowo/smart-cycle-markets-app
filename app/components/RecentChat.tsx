import AvatarView from "@ui/AvatarView";
import colors from "@utils/colors";
import { formatDate } from "@utils/date";
import size from "@utils/size";
import { FC } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

interface Props {
  avatar?: string;
  name: string;
  message: string;
  timestamp: string;
  unreadMessageCount: number;
}

const { width } = Dimensions.get("window");

const profileImageSize = 50;
const itemWidth = width - size.padding * 2;
const separatorWidth = width - profileImageSize - size.padding * 3;

const RecentChat: FC<Props> = ({
  avatar,
  name,
  timestamp,
  message,
  unreadMessageCount,
}) => {
  const showNotification = unreadMessageCount > 0;
  return (
    <View style={styles.container}>
      <AvatarView uri={avatar} size={profileImageSize} />
      <View style={styles.chatInfo}>
        <View style={styles.flexJustifyBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {name}
            </Text>
          </View>
          <Text
            style={showNotification ? styles.activeText : styles.inActiveText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatDate(timestamp)}
          </Text>
        </View>
        <View style={styles.flexJustifyBetween}>
          <View style={styles.flexOne}>
            <Text
              style={styles.commonText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {message}
            </Text>
          </View>

          {showNotification ? (
            <View style={styles.msgIndicator}>
              <Text style={styles.msgIndicatorCount}>{unreadMessageCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default RecentChat;

export const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: itemWidth,
  },
  chatInfo: {
    width: itemWidth - profileImageSize,
    paddingLeft: size.padding,
  },

  flexJustifyBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexOne: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: size.padding,
  },
  commonText: {
    fontSize: 12,
    color: colors.primary,
  },
  inActiveText: {
    fontSize: 12,
    color: colors.primary,
  },

  activeText: {
    fontSize: 12,
    color: colors.active,
  },

  msgIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.active,
    alignItems: "center",
    justifyContent: "center",
  },
  msgIndicatorCount: {
    fontSize: 12,
    color: colors.white,
  },

  separator: {
    width: separatorWidth,
    backgroundColor: colors.deActive,
    height: 1,
    alignSelf: "flex-end",
    marginVertical: 15,
  },
});
