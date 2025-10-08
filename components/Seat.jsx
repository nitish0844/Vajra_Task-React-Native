import { StyleSheet, View, ImageBackground } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS, FONTS, SIZES } from "@/constants/theme";
import { memo, useMemo } from "react";
import seatImage from "@/assets/images/seat.png";

/**
 * Seat Component - Represents an individual seat in the aircraft
 * Memoized to prevent unnecessary re-renders when parent updates
 * 
 * @param {string} seatNo - The seat number (e.g., "1A", "2B")
 * @param {boolean} active - Whether the seat is in active state
 * @param {boolean} reverse - Whether the seat should be displayed in reverse orientation
 * @param {boolean} hasOrder - Whether there's an order associated with this seat
 * @param {Object} rotationStyle - Shared animation style from parent for smooth rotation
 */
const Seat = memo(({ seatNo, active, reverse, hasOrder, rotationStyle }) => {
  // Memoize text style calculations to prevent recalculation on every render
  // Only recalculates when reverse or active props change
  const seatTextStyle = useMemo(() => [
    styles.seatText,
    reverse && styles.reverseStyle,
    active ? { color: COLORS.white } : {}
  ], [reverse, active]);

  return (
    // Use shared rotation animation style from parent for better performance
    <Animated.View style={[styles.seat, rotationStyle]}>
      <ImageBackground
        source={seatImage}
        style={styles.seatImage}
        resizeMode="contain"
      >
        {/* Container for seat number text */}
        <View style={styles.seatTextContainer}>
          <Animated.Text style={seatTextStyle}>
            {seatNo}
          </Animated.Text>
        </View>
      </ImageBackground>
      {/* Orange dot indicator for seats with orders */}
      {hasOrder && (<View style={styles.orderDot} />)}
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if any of these props change
  // This is crucial for performance with 70+ seats
  return prevProps.seatNo === nextProps.seatNo &&
         prevProps.active === nextProps.active &&
         prevProps.reverse === nextProps.reverse &&
         prevProps.hasOrder === nextProps.hasOrder &&
         prevProps.rotationStyle === nextProps.rotationStyle;
});

// Styles are defined outside component to prevent recreation on each render
const styles = StyleSheet.create({
  seat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Required for absolute positioning of orderDot
  },
  seatTextContainer: {
    width: "100%",
    paddingTop: SIZES.padding * 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  seatImage: {
    width: 54,
    height: "100%",
  },
  seatText: {
    ...FONTS.h5,
    color: COLORS.primary,
  },
  reverseStyle: {
    transform: [{ rotate: "180deg" }], // Rotates just the text for reverse orientation
  },
  orderDot: {
    position: "absolute",
    top: 0,
    right: 5,
    zIndex: 0,
    backgroundColor: "orange",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default Seat;
