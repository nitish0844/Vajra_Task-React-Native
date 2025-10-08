import { COLORS, FONTS, SIZES } from "@/constants/theme";
import { IconInfoCircle } from "@tabler/icons-react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const ErrorBoundaryPage = ({ error, resetError }) => {
  return (
    <View style={styles.fallbackContainer}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
        <View style={{ flexDirection: "row", marginBottom: 20, alignItems: "center", gap: SIZES.padding }}>
          <IconInfoCircle color="white" size={40} />
          <Text style={{ ...FONTS.largeTitle, color: COLORS.white }}>
            Sorry!
          </Text>
        </View>
        <Text style={{ ...FONTS.h4, color: COLORS.white, marginBottom: SIZES.base }}>
          {error?.message || 'Something went wrong.'}
        </Text>
        <Text style={{ ...FONTS.h4, color: COLORS.white, marginBottom: SIZES.padding * 2 }}>
          Please contact the administrator.
        </Text>
        <Text style={{ ...FONTS.h6, color: COLORS.white, marginBottom: 0 }}>
          {error?.toString() ?? 'Unknown error' }
        </Text>
      </View>
      <TouchableOpacity
        style={styles.fallbackButton}
        onPress={resetError} // Replace resetError with your restart logic
      >
        <Text style={styles.fallbackButtonText}>Click to restart app</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary, // LightCOLORS.primarybackground for fallback
  },
  fallbackButton: {
    width: "100%",
    marginVertical: 20,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
  },
  fallbackText: {
    ...FONTS.h6,
    color: COLORS.primary,
  },
});

export default ErrorBoundaryPage