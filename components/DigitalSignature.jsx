import { COLORS, FONTS, SIZES } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Button, StyleSheet, Image, Modal, Text } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

const SignaturePad = ({ visible, onClose }) => {
    const signatureRef = useRef(null);
    const [signature, setSignature] = useState(null);
    const [hasScribble, setHasScribble] = useState(false);

    const handleSignature = (signature) => {
        setSignature(signature); // Save the signature as Base64
    };

    const handleBegin = () => {
        setHasScribble(true); // User started drawing
    };

    const handleClear = () => {
        signatureRef.current?.clearSignature();
        setHasScribble(false); // Reset scribble state
        setSignature(null);
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            presentationStyle="overFullScreen"
            animationType="fade"
            transparent
            style={styles.modalRoot}
        >
            <View style={styles.root}>
                <View style={styles.modalContainer}>
                    <View style={styles.listContainer}>

                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.modalTitleText}>Add Signature</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={{ ...FONTS.h4 }}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <SignatureCanvas
                            ref={signatureRef}
                            onEmpty={() => alert('Please provide a signature')}
                            descriptionText=""
                            clearText=""
                            confirmText=""
                            onBegin={handleBegin}
                            webStyle={styles.signaturePad}
                        />

                        {/* Action Buttons in center with 2 halves */}
                        <View style={styles.buttonRow}>
                            <View style={styles.buttonHalf}>
                                <Button title="Clear" onPress={handleClear} color={COLORS.primary} />
                            </View>

                            {hasScribble && (
                                <View style={styles.buttonHalf}>
                                    <Button
                                        title="Save"
                                        onPress={() => signatureRef.current?.readSignature()}
                                        color={COLORS.primary}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    signaturePad: `
    .m-signature-pad {
      box-shadow: none; 
      border: 1px solid #ccc;
      background-color: #f5f5f5; /* Set canvas background */
      border-radius: 8px;
    }
    .m-signature-pad--footer {
      display: none; /* Hide default footer */
    }
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      background-color: #f5f5f5; /* Match canvas bg */
    }
  `,
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
    },
    buttonHalf: {
        flex: 1,
        marginHorizontal: 5,
    },
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
        height: SIZES.height * 0.8,
        width: SIZES.width * 0.9,
        paddingVertical: SIZES.padding * 2,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius / 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitleContainer: {
        padding: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // Needed for absolute positioning of X
    },
    modalTitleText: {
        ...FONTS.h3,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: SIZES.padding / 2,
    },
});

export default SignaturePad;
