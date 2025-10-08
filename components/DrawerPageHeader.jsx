import { COLORS, FONT_FAMILY, FONTS, SIZES } from "@/constants/theme";
import { useNavigation } from "@react-navigation/native";
import { IconMenuDeep, IconRefresh } from "@tabler/icons-react-native";
import { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DrawerPageHeader = ({ title, isReloadIcon = false, onReload  }) => {
  const navigation = useNavigation();

  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.headerActionContainer}>
        <TouchableOpacity style={headerStyles.headerMenuButton} onPress={() => navigation.openDrawer()}>
          <IconMenuDeep color={COLORS.white} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      <View style={headerStyles.headerTitleContainer}>
        <Text style={headerStyles.headerTitle}>{title}</Text>
      </View>
      <View style={headerStyles.headerActionContainer}>
        {
          isReloadIcon &&
          <TouchableOpacity style={headerStyles.headerActionButton} onPress={onReload}>
            <IconRefresh color={COLORS.white} strokeWidth={1.5} />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    paddingTop: SIZES.padding * 4,
  },
  headerTitleContainer: {
    flex: 1,
    paddingVertical: SIZES.padding
  },
  headerTitle: {
    ...FONTS.h4,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.white,
  },
  headerActionContainer: {
    flexDirection: 'row',
    gap: SIZES.padding,
    alignItems: 'center',
  },
  headerMenuButton: {
    padding: SIZES.padding,
    paddingHorizontal: SIZES.padding * 1.5,
  },
  headerActionButton: {
    padding: SIZES.padding,
  },
});

export default DrawerPageHeader;