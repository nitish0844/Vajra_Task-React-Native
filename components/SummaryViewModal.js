import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView
} from "react-native";
import { SIZES, COLORS, FONTS, FONT_FAMILY } from "../constants/theme";
import useActiveLegStore from "@/store/activeLegStore";

const SummaryViewModal = ({
  show = false,
  onClose,
  orderSummaryQuery,
  handleSubmit,
  isEndJourney,
  isUsersLastLeg,
  handleRowPress,
}) => {
  const [visible, setVisible] = useState(show);
  const { leg: activeLeg, isSCC } = useActiveLegStore()?.data;

  const totalRow = useMemo(() => {
    if (!orderSummaryQuery.data) {
      return {
        totalPurchasedQuantity: 0,
        totalPurchasedPrice: 0,
        totalFocQuantity: 0,
        totalFocPrice: 0,
        closingBalance: 0,
      };
    }

    const totalPurchased = orderSummaryQuery?.data?.purchased?.reduce(
      (acc, item) => {
        acc.totalPurchasedQuantity += item.quantity;
        acc.totalPurchasedPrice += item.price;
        return acc;
      },
      { totalPurchasedQuantity: 0, totalPurchasedPrice: 0 }
    );

    const totalFoc = orderSummaryQuery?.data?.foc?.reduce(
      (acc, item) => {
        acc.totalFocQuantity += item.quantity;
        acc.totalFocPrice += item.price;
        return acc;
      },
      { totalFocQuantity: 0, totalFocPrice: 0 }
    );

    const closingBalance = Object.values(
      orderSummaryQuery?.data?.closingBalance || {}
    )?.reduce((acc, item) => {
      acc += isSCC ? item?.available_scc : item?.available_cc;
      return acc;
    }, 0);

    return {
      ...totalPurchased,
      ...totalFoc,
      closingBalance,
    };
  }, [orderSummaryQuery.data]);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <View style={{ width: "100%", height: "100%", position: "absolute" }}>
      <Modal
        visible={visible}
        onRequestClose={onClose}
        presentationStyle="overFullScreen"
        animationType="fade"
        transparent
        style={styles.modalRoot}
      >
        <View style={styles.root} activeOpacity={1}>
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={[styles.listContainer, { paddingBottom: SIZES.height * 0.1, flexGrow: 1 }]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitleText}>
                  Thank you very much for your efforts.
                </Text>
                <Text style={styles.modalDescText}>
                  Here is your summary. ({activeLeg?.sector_pattern})
                </Text>
              </View>
              <View style={[styles.tableContainer]}>
                <View key={"head2"} style={styles.tableHeader}>
                  <Text style={styles.th}>Flight</Text>
                  <Text style={styles.th}>Route</Text>
                  <Text style={[styles.th, styles.right]}>Sold Qty</Text>
                  <Text style={[styles.th, styles.right]}>Price</Text>
                  <Text style={[styles.th, styles.right]}>Closing Bal</Text>
                </View>
                {orderSummaryQuery?.data?.purchased?.map((order, index) => {
                  return (
                    <TouchableOpacity
                      key={"row" + index}
                      style={styles.tableRow}
                      onPress={() =>
                        handleRowPress({
                          selectedOrder: order,
                          foc: false,
                        })
                      }
                    >
                      <Text style={styles.td}>{order?.flight_number}</Text>
                      <Text style={styles.td}>
                        {order?.departure_airport}-{order?.arrival_airport}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        {order?.quantity}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        ₹ {order?.price}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        {isSCC
                          ? orderSummaryQuery?.data?.closingBalance?.[
                              order?.flight_number
                            ]?.available_scc
                          : orderSummaryQuery?.data?.closingBalance?.[
                              order?.flight_number
                            ]?.available_cc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <View key={"total"} style={styles.tableFooter}>
                  <Text style={styles.th}></Text>
                  <Text style={styles.th}>Total</Text>
                  <Text style={[styles.th, styles.right]}>
                    {totalRow?.totalPurchasedQuantity}
                  </Text>
                  <Text style={[styles.th, styles.right]}>
                    ₹ {totalRow?.totalPurchasedPrice}
                  </Text>
                  <Text style={[styles.th, styles.right]}>
                    {isSCC
                      ? orderSummaryQuery?.data?.closingBalance?.[
                          activeLeg?.flight_number
                        ]?.available_scc
                      : orderSummaryQuery?.data?.closingBalance?.[
                          activeLeg?.flight_number
                        ]?.available_cc}
                  </Text>
                </View>
              </View>
              {/* FOC - Free Of Cost */}

              {orderSummaryQuery?.data?.foc?.length ? (
                <View
                  style={[
                    styles.tableContainer,
                    { marginTop: SIZES.padding * 2 },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalDescText,
                      {
                        ...FONTS.h5,
                        textAlign: "center",
                      },
                    ]}
                  >
                    FOC
                  </Text>
                  <View key={"head2"} style={styles.tableHeader}>
                    <Text style={styles.th}>Flight</Text>
                    <Text style={styles.th}>Route</Text>
                    <Text style={[styles.th, styles.right]}>Sold Qty</Text>
                    <Text style={[styles.th, styles.right]}>Price</Text>
                    <Text style={[styles.th, styles.right]}>Closing Bal</Text>
                  </View>
                  {orderSummaryQuery?.data?.foc?.map((order, index) => {
                    return (
                      <TouchableOpacity
                        key={"row" + index}
                        style={styles.tableRow}
                        onPress={() =>
                          handleRowPress({
                            selectedOrder: order,
                            foc: true,
                          })
                        }
                      >
                        <Text style={styles.td}>{order?.flight_number}</Text>
                        <Text style={styles.td}>
                          {order?.departure_airport}-{order?.arrival_airport}
                        </Text>
                        <Text style={[styles.td, styles.right]}>
                          {order?.quantity}
                        </Text>
                        <Text style={[styles.td, styles.right]}>
                          ₹ {order?.price}
                        </Text>
                        <Text style={[styles.td, styles.right]}>
                          {isSCC
                            ? orderSummaryQuery?.data?.closingBalance?.[
                                order?.flight_number
                              ]?.available_scc
                            : orderSummaryQuery?.data?.closingBalance?.[
                                order?.flight_number
                              ]?.available_cc}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <View key={"total"} style={styles.tableFooter}>
                    <Text style={styles.th}></Text>
                    <Text style={styles.th}>Total</Text>
                    <Text style={[styles.th, styles.right]}>
                      {totalRow?.totalFocQuantity}
                    </Text>
                    <Text style={[styles.th, styles.right]}>
                      ₹ {totalRow?.totalFocPrice}
                    </Text>
                    <Text style={[styles.th, styles.right]}>
                      {isSCC
                        ? orderSummaryQuery?.data?.closingBalance?.[
                            activeLeg?.flight_number
                          ]?.available_scc
                        : orderSummaryQuery?.data?.closingBalance?.[
                            activeLeg?.flight_number
                          ]?.available_cc}
                    </Text>
                  </View>
                </View>
              ) : null}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[styles.actionButton, styles.saveButton]}
                >
                  <Text style={styles.saveButtonText}>
                    {isEndJourney || isUsersLastLeg
                      ? "End Journey"
                      : "Continue"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.actionButton, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    zIndex: 1000,
    elevation: 1000,
  },
  root: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: COLORS.shade1trans,
  },
  modalContainer: {
  flex: 1, 
  position: "absolute",
  bottom: 0,
  maxHeight: SIZES.height * 0.8,
  width: "100%",
  backgroundColor: COLORS.white,
  borderTopLeftRadius: SIZES.radius / 2,
  borderTopRightRadius: SIZES.radius / 2,
  shadowColor: COLORS.black,
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 10,
},
  listContainer: {
    width: SIZES.width,
    paddingVertical: SIZES.padding * 2,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitleContainer: { padding: SIZES.padding, alignItems: "center" },
  modalTitleText: { ...FONTS.h4 },
  modalDescText: { ...FONTS.body5, textAlign: "left" },
  tableContainer: {
    flexDirection: "column",
  },
  tableHeader: {
    height: 56,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2,
  },
  th: {
    flex: 1,
    ...FONTS.h6,
    fontSize: SIZES.h6 - 1,
    textAlign: "left",
    color: COLORS.white,
    padding: SIZES.padding / 1.5,
    fontFamily: FONT_FAMILY.semiBold,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.shade4,
    height: 38,
  },
  td: {
    flex: 1,
    ...FONTS.body6,
    color: COLORS.black2,
    textAlign: "left",
    padding: SIZES.padding / 1.5,
  },
  right: {
    textAlign: "right",
  },
  tableFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    height: 38,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2,
  },
  buttonsContainer: {
    flexDirection: "column",
    // justifyContent: "space-between",
    gap: SIZES.padding,
    marginTop: SIZES.padding * 2,
    marginHorizontal: SIZES.padding * 2,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    minHeight: 50,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    // marginRight: SIZES.padding,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  saveButtonText: {
    ...FONTS.h5,
    color: COLORS.white,
  },
  cancelButtonText: {
    ...FONTS.h5,
    color: COLORS.primary,
  },
});

export default SummaryViewModal;
