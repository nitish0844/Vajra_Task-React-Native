import React from "react";
import dayjs from "dayjs";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, FONTS, FONT_FAMILY } from "../constants/theme";

const flightImage = require("../assets/images/flight.png");
const logoImage = require("../assets/images/logo.png");

const FlightDetailsCard = ({
  id,
  flightNumber,
  date,
  origin,
  destination,
  originCity,
  destinationCity,
  departureTime,
  sectorPattern,
  onConfirm,
  onEdit,
  status
}) => {
  const formattedDate = dayjs(new Date(date)).format("DD MMM YYYY");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={logoImage}
          style={styles.topLeftImage}
          resizeMode="contain"
        />
        <View style={styles.flightNumberContainer}>
          <Text style={styles.flightNo}>FLIGHT</Text>
          <Text style={styles.flightNumber}>{flightNumber}</Text>
          <Text style={styles.sector}>{sectorPattern}</Text>
        </View>
      </View>
      <View style={styles.blueContainer}>
        <View style={styles.paddingContainer}>
          <View style={styles.row}>
            <View style={styles.origin}>
              <Text style={styles.labelPlace}>{originCity}</Text>
              <Text style={styles.valuePlace}>{origin}</Text>
            </View>
            <Image source={flightImage} resizeMode="contain" height={25} width={25} />
            <View style={styles.destination}>
              <Text style={styles.labelPlace}>{destinationCity}</Text>
              <Text style={styles.valuePlace}>{destination}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.timeContainer}>
              <Text style={styles.label}>DEPARTURE</Text>
              <Text style={styles.value}>
                {dayjs(date + " " + departureTime).format("HH:mm")}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.label}>DATE</Text>
              <Text style={styles.value}>{formattedDate}</Text>
            </View>
          </View>
        </View>
        {/* {(onEdit || onConfirm) && (
          <View style={styles.buttonRow}>
            {onEdit && (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={onEdit}
              >
                <Text style={[styles.buttonText, styles.editButtonText]}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            )}
          </View>
        )} */}

        {status?.toLowerCase() === "cancelled" ? (
          <View style={[styles.button, styles.editButton]}>
            <Text style={[styles.buttonText, { color: 'red' }]}>Sector Cancelled</Text>
          </View>
        ) : (
          (onEdit || onConfirm) && (
            <View style={styles.buttonRow}>
              {onEdit && (
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={onEdit}
                >
                  <Text style={[styles.buttonText, styles.editButtonText]}>
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
              {onConfirm && (
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // shadowColor: COLORS.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    width: "100%",
  },
  header: {
    // height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  topLeftImage: {
    width: 108,
    height: 29,
  },
  blueContainer: {
    backgroundColor: COLORS.tertiary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  paddingContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  origin: {
    flex: 1,
    alignItems: "flex-start",
  },
  destination: {
    flex: 1,
    alignItems: "flex-end",
  },
  flightNumberContainer: {
    alignItems: "flex-end",
  },
  flightNo: {
    ...FONTS.body6,
  },
  flightNumber: {
    ...FONTS.body2,
    color: COLORS.tertiary,
  },
  sector: {
    ...FONTS.body6,
    color: COLORS.tertiary,
  },
  label: {
    ...FONTS.body6,
    color: COLORS.white,
  },
  value: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  labelPlace: {
    ...FONTS.body6,
    color: COLORS.white,
  },
  valuePlace: {
    ...FONTS.body1,
    color: COLORS.white,
    borderWidth: 0,
  },
  timeContainer: {
    alignItems: "start",
  },
  buttonRow: {
    flexDirection: "row",
    margin: 0,
    padding: 0,
  },
  button: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#f4eed7",
    borderBottomRightRadius: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.primary,
  },
  editButton: {
    backgroundColor: "#f4eed7",
    borderBottomLeftRadius: 10,
  },
  buttonText: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.semiBold,
    borderWidth: 0,
  },
  editButtonText: {
    ...FONTS.body3,
    color: "#048097",
  },
});

export default FlightDetailsCard;
