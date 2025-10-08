import { COLORS, FONT_FAMILY, FONTS, SIZES } from "../constants/theme";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import SimpleButton from "./SimpleButton";
import { IconRosetteDiscountCheck } from "@tabler/icons-react-native";
import { Toasts, toast } from "@backpackapp-io/react-native-toast";
import disableBack from "@/hoc/disableBack";

const PaymentCompleteForm = ({ visible = false, seat, handleSubmit, loading }) => {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (name) => (value) => {
    setFormValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleInvoiceSubmit = async () => {
    const { invoice_pnr, invoice_email, invoice_mobile } = formValues;
    if (!invoice_pnr && !invoice_email && !invoice_mobile) {
      toast.error("Please fill in the details");
      return;
    }

    const isValidPnr = (pnr) => typeof pnr === "string" && pnr.trim() !== "";
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = (email) => re.test(String(email).toLowerCase());
    const isValidMobile = (mobile) => /^\d{6,}$/.test(mobile); // At least 6 digits

    //email validation for invoice_email
    if (
      isValidPnr(invoice_pnr) ||
      isValidEmail(invoice_email) ||
      isValidMobile(invoice_mobile)
    ) {
      // addNewOrderItem(result);
      // onClose();
      toast.success("Invoice Request Submitted");
      handleSubmit({
        invoice_pnr,
        invoice_email,
        invoice_mobile,
      });
      return;
    }

    toast.error("Invalid Details! Fill in the correct details");
  };

  const handleContinue = () => {
    // addNewOrderItem(data);
    // onClose();
    handleSubmit();
  };

  if(!visible) return null;

  return (
    <View style={{ width: "100%", height: "100%", position: "absolute" }}>
      <Modal
        visible={visible}
        presentationStyle='overFullScreen'
        animationType='fade'
        style={styles.root}>
        
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.purchaseContainer}>
              <IconRosetteDiscountCheck
                color={COLORS.success}
                size={60}
                strokeWidth={1.5}
              />
              <Text style={styles.headerText}>Purchase Done ({seat})</Text>
            </View>
          </View>
          <View style={styles.formOuterContainer}>
            <View style={styles.formContainer}>
              <View>
                <Text style={styles.title}>Need Invoice?</Text>
                <Text style={styles.subtitle}>
                  Please fill in the below details and submit to send invoice to
                  customer. He/She will receive the invoice after successful sync.
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>PNR</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleInputChange("invoice_pnr")}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email ID</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={handleInputChange("invoice_email")}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile No</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleInputChange("invoice_mobile")}
                />
              </View>
              {
                loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  </View>
                ) : (
                  <View
                    flexDirection="column"
                    gap={SIZES.padding * 2}
                    style={styles.buttonContainer}
                  >
                    <SimpleButton
                      text="Send Invoice Request"
                      color={COLORS.primary}
                      textColor={COLORS.white}
                      action={handleInvoiceSubmit}
                      containerStyle={styles.submitButton}
                    />
                    <SimpleButton
                      text="Not Required"
                      color={COLORS.white}
                      textColor={COLORS.primary}
                      action={handleContinue}
                      containerStyle={styles.goBackButton}
                      />
                    </View>
                  )
              }
            </View>
          </View>
          <Toasts />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    zIndex: 1000,
    elevation: 1000,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "flex-end",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.padding * 4,
  },
  purchaseContainer: {
    alignItems: "center",
  },
  headerText: {
    ...FONTS.h2,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.white,
  },
  formOuterContainer: {
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    paddingTop: SIZES.padding,
    // zIndex: -1,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    padding: SIZES.padding * 3,
    // height: SIZES.height * 0.8,
    justifyContent: "space-between",
  },
  title: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: SIZES.padding / 2,
  },
  subtitle: {
    ...FONTS.body5,
    color: COLORS.shade2,
    marginBottom: SIZES.padding,
  },
  inputContainer: {
    marginBottom: SIZES.padding,
  },
  label: {
    ...FONTS.body5,
    color: COLORS.shade2,
    marginBottom: SIZES.padding / 4,
  },
  input: {
    ...FONTS.body5,
    height: 60,
    borderColor: COLORS.shade4,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding * 2,
  },
  uploadButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.padding,
    borderRadius: SIZES.radius / 3,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.shade4,
    borderStyle: "dashed",
    marginBottom: SIZES.padding,
  },
  uploadButtonText: {
    ...FONTS.body5,
    color: COLORS.shade2,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: SIZES.padding,
  },
  buttonContainer: {
    marginVertical: SIZES.padding * 2,
  },
  submitButton: {
    alignSelf: "center",
    width: "100%",
    minHeight: 60,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
  },
  goBackButton: {
    minHeight: 60,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default disableBack(PaymentCompleteForm);
