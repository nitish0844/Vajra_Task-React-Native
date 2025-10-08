import { View, StyleSheet } from "react-native"
import { COLORS, SIZES } from "@/constants/theme"

export const MainContainer = ({ children }) => {
  return (
    <View style={styles.mainContainer}>
      {children}
    </View>
  )
}

export const SecondaryContainer = ({ children, style }) => {
  return (
    <View style={[styles.secondaryContainer, style]}>
      {children}
    </View>
  )
}

export const HeaderBackground = () => <View style={styles.headerBackground} />

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    position: "relative",
    backgroundColor: COLORS.background2,
    paddingBottom: SIZES.padding,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SIZES.padding * 10,
    backgroundColor: COLORS.primary,
  },
  secondaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.padding * 2,
    marginHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
    paddingTop: SIZES.padding * 1.5,
    marginTop: SIZES.padding,
    justifyContent: "center",
    shadowColor: "rgba(0,0,0,.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.shade5,
  },
})
