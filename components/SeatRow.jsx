import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Seat from "./Seat";
import { COLORS, SIZES } from "@/constants/theme";
import { memo, useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

/**
 * SeatsRow Component - Renders a row of seats in the aircraft
 * Uses shared animation value for all seats in the row for better performance
 * 
 * @param {number} row - The row number
 * @param {boolean} isReversed - Whether the seats should be displayed in reverse orientation
 * @param {Object} activeData - Contains flight details (flight number, airports)
 * @param {Array} seats - Array of seat letters (e.g., ["A", "C", "D", "F"])
 * @param {Array} seatsWithOrders - Array of seat numbers that have orders
 * @param {Function} handleSeatPress - Callback for seat selection
 */
const SeatsRow = memo(({ row, isReversed, activeData, seats, seatsWithOrders=[], handleSeatPress }) => {
  // Single shared animation value for all seats in the row
  // This is crucial for performance as it reduces the number of animated values
  const rotation = useSharedValue(0);

  // Update rotation value when isReversed changes
  // Using withTiming for smooth animation
  useEffect(() => {
    rotation.value = withTiming(isReversed ? 180 : 0, { duration: 500 });
  }, [isReversed]);

  // Create shared animation style that will be passed to all seats
  // This style is reused by all seats in the row instead of each seat managing its own animation
  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Memoized press handler factory
  // Returns a function that handles seat selection
  const onPress = (seatNo) => () => {
    const selectedSeatValue = `${row}${seatNo}`;
    if (seatsWithOrders.includes(selectedSeatValue)) {
      // Handle seats that already have orders
      handleSeatPress({
        row,
        seatNo,
        seat: selectedSeatValue,
        withOrder: true
      });
    } else {
      // Handle empty seats
      handleSeatPress({
        row,
        seatNo,
        seat: selectedSeatValue
      });
    }
  };

  return (
    <View style={[styles.rowContainer, row % 2 === 0 ? styles.rowColor : null]}>
      {/* Left seat group (2 seats) */}
      <View style={styles.seatGroup}>
        <TouchableOpacity style={styles.seat} onPress={onPress(seats[0])}>
          <Seat
            seatNo={`${row}${seats[0]}`}
            reverse={isReversed}
            hasOrder={seatsWithOrders.includes(`${row}${seats[0]}`)}
            rotationStyle={rotationStyle} // Pass shared animation style
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.seat} onPress={onPress(seats[1])}>
          <Seat
            seatNo={`${row}${seats[1]}`}
            reverse={isReversed}
            hasOrder={seatsWithOrders.includes(`${row}${seats[1]}`)}
            rotationStyle={rotationStyle}
          />
        </TouchableOpacity>
      </View>

      {/* Center gap with flight information */}
      <View style={styles.centerGap}>
        {/* Show flight number every 4th row */}
        {row % 4 === 0 ? (
          <Text style={styles.centerGapText}>{activeData?.flight_number}</Text>
        ) : null}
        {/* Show route information every 3rd row (except when showing flight number) */}
        {row % 3 === 0 && row % 4 !== 0 ? (
          <Text style={styles.centerGapText}>
            {activeData?.depart_airport_code}-
            {activeData?.arrival_airport_code}
          </Text>
        ) : null}
      </View>

      {/* Right seat group (2 seats) */}
      <View style={styles.seatGroup}>
        <TouchableOpacity style={styles.seat} onPress={onPress(seats[2])}>
          <Seat
            seatNo={`${row}${seats[2]}`}
            reverse={isReversed}
            hasOrder={seatsWithOrders.includes(`${row}${seats[2]}`)}
            rotationStyle={rotationStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.seat} onPress={onPress(seats[3])}>
          <Seat
            seatNo={`${row}${seats[3]}`}
            reverse={isReversed}
            hasOrder={seatsWithOrders.includes(`${row}${seats[3]}`)}
            rotationStyle={rotationStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Deep comparison of props to prevent unnecessary re-renders
  // This is crucial for performance as each row contains 4 seats
  return prevProps.row === nextProps.row &&
         prevProps.isReversed === nextProps.isReversed &&
         prevProps.activeData?.flight_number === nextProps.activeData?.flight_number &&
         prevProps.activeData?.depart_airport_code === nextProps.activeData?.depart_airport_code &&
         prevProps.activeData?.arrival_airport_code === nextProps.activeData?.arrival_airport_code &&
         JSON.stringify(prevProps.seats) === JSON.stringify(nextProps.seats) &&
         JSON.stringify(prevProps.seatsWithOrders) === JSON.stringify(nextProps.seatsWithOrders);
});

// Styles defined outside component to prevent recreation on each render
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowColor: {
    borderRadius: SIZES.padding,
  },
  seatGroup: {
    flexDirection: "row",
    flex: 2,
    justifyContent: "space-between",
  },
  seat: {
    borderRadius: 8,
    backgroundColor: COLORS.white,
    flex: 1,
    margin: 4,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  centerGap: {
    flex: 1,
    backgroundColor: COLORS.shade6trans,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  centerGapText: {
    color: COLORS.shade4,
    fontSize: 12.5,
    transform: [{ rotate: "-90deg" }],
  },
  centerGapTextNormal: {
    color: COLORS.shade4,
    fontSize: 12.5,
  },
});

export default SeatsRow;