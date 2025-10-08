import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { SIZES, COLORS, FONTS, FONT_FAMILY } from '../constants/theme';

const OrderDetailsModal = ({ show = false, onClose, data }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show)
    }, [show]);

    if (!visible) return null;

    return (
        <View style={{ width: "100%", height: "100%", position: "absolute" }}>
            <Modal
                visible={visible}
                onRequestClose={onClose}
                presentationStyle='overFullScreen'
                animationType='fade'
                transparent
                style={styles.modalRoot}
            >
                <TouchableOpacity style={styles.root} disabled activeOpacity={1}>
                    <View style={styles.modalContainer}>
                        <View style={styles.listContainer}>
                            <View style={styles.modalTitleContainer}>
                                <Text style={styles.modalTitleText}>
                                    {data?.isFOC ? "FOC" : "Sales"} Detail
                                </Text>
                                <Text style={styles.modalDescText}>
                                    Here is your {data?.isFOC ? "FOC" : "sales"} detail.
                                    ({data?.order?.departure_airport}-
                                    {data?.order?.arrival_airport})
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.tableContainer,
                                    { flex: 1, maxHeight: SIZES.height * 0.9, overflow: "hidden" },
                                ]}
                            >
                                <FlatList
                                    keyboardShouldPersistTaps="handled"
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    data={data?.list || []}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListHeaderComponent={
                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.th, { flex: 3 }]}>Product</Text>
                                            <Text style={[styles.th, styles.right]}>Sold Quantity</Text>
                                            <Text style={[styles.th, styles.right]}>Price</Text>
                                        </View>
                                    }
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View key={"row" + index} style={[styles.tableRow]}>
                                                <Text style={[styles.td, { flex: 3 }]}>
                                                    {item?.product_name}
                                                </Text>
                                                <Text style={[styles.td, styles.right]}>
                                                    {item?.quantity}
                                                </Text>
                                                <Text style={[styles.td, styles.right]}>
                                                    ₹ {item?.price}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                />
                                <View style={[styles.buttonsContainer, { height: 140 }]}>
                                    <TouchableOpacity
                                        onPress={() => onClose()}
                                        style={[
                                            styles.actionButton,
                                            styles.cancelButton,
                                            { maxHeight: 50 },
                                        ]}
                                    >
                                        <Text style={styles.cancelButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalRoot: {
        zIndex: 1000,
        elevation: 1000,
    },
    root: {
        flex: 1,
        width: SIZES.width,
        height: SIZES.height,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: COLORS.shade1trans,
    },
    listContainer: {
        // maxHeight: SIZES.height,
        height: SIZES.height * 0.8,
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
    modalTitleContainer: { padding: SIZES.padding, alignItems: 'center' },
    modalContainer: {
  position: "absolute",
  bottom: 0,
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
    modalTitleText: { ...FONTS.h4 },
    modalDescText: { ...FONTS.body5, textAlign: 'left' },
    tableContainer: {
        flexDirection: 'column',
    },
    tableHeader: {
        height: 56,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.primary2
    },
    th: {
        flex: 1,
        ...FONTS.h6,
        fontSize: SIZES.h6 - 1,
        textAlign: 'left',
        color: COLORS.white,
        padding: SIZES.padding / 1.5,
        fontFamily: FONT_FAMILY.semiBold
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.shade4,
        height: 38
    },
    td: {
        flex: 1,
        ...FONTS.body6,
        color: COLORS.black2,
        textAlign: 'left',
        padding: SIZES.padding / 1.5
    },
    right: {
        textAlign: 'right'
    },
    tableFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        height: 38,
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.primary2
    },
    buttonsContainer: {
        flexDirection: "column",
        // justifyContent: "space-between",
        gap: SIZES.padding * 2,
        marginTop: SIZES.padding * 2,
        marginHorizontal: SIZES.padding * 2
    },
    actionButton: {
        flex: 1,
        padding: 15,
        minHeight: 50,
        borderRadius: SIZES.radius,
        alignItems: 'center'
    },
    saveButton: {
        backgroundColor: COLORS.primary
        // marginRight: SIZES.padding,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginTop: SIZES.padding * 1.5
    },
    saveButtonText: {
        ...FONTS.h5,
        color: COLORS.white
    },
    cancelButtonText: {
        ...FONTS.h5,
        color: COLORS.primary
    }
})

export default OrderDetailsModal;
