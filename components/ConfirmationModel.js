import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { SIZES, COLORS, FONTS } from '../constants/theme';

const ConfirmationModal = ({ label, show = false, onClose, button1 = {}, button2 = {} }) => {
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
                <TouchableOpacity style={styles.root} onPress={onClose} activeOpacity={1}>
                    <View style={styles.modalContainer}>
                        <View style={styles.listContainer}>
                            <View style={styles.modalTitleContainer}>
                                <Text style={styles.modalTitleText}>{label}</Text>
                            </View>

                            {button1 && <View style={styles.buttonsContainer}>
                                <TouchableOpacity onPress={button1.onPress} style={[styles.actionButton, styles.button1]}>
                                    <Text style={[styles.button, { color: COLORS.black}]}>{button1.label}</Text>
                                </TouchableOpacity>
                            </View>}

                            {button2 && <View style={styles.buttonsContainer}>
                                <TouchableOpacity onPress={button2.onPress} style={[styles.actionButton, styles.button2]}>
                                    <Text style={[styles.button, { color: COLORS.white}]}>{button2.label}</Text>
                                </TouchableOpacity>
                            </View>}

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
        backgroundColor: COLORS.shade1trans,
    },
    modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    listContainer: {
        maxHeight: SIZES.height * 0.75,
        width: SIZES.width * 0.8,
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
    modalTitleText: { ...FONTS.h3, textAlign: "center" },
    list: { paddingVertical: SIZES.padding, marginBottom: SIZES.padding * 2 },
    optionItem: { padding: SIZES.padding, paddingLeft: SIZES.padding * 2, flexDirection: 'row' },
    buttonsContainer: {
        flexDirection: "column",
        marginTop: SIZES.padding,
        marginHorizontal: SIZES.padding * 2
    },
    actionButton: {
        padding: 15,
        borderRadius: SIZES.radius,
        alignItems: 'center'
    },
    button: {
        ...FONTS.h5,
    },
    button1: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginTop: SIZES.padding * 1.5,
        width: SIZES.width * 0.7
    },
    button2: {
        backgroundColor: COLORS.primary,
        borderRadius: 40,
        width: SIZES.width * 0.7,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    }
})

export default ConfirmationModal;
