import QRCode from "react-native-qrcode-svg";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { SIZES, COLORS, FONTS } from "../constants/theme";
import { IconBubbleText } from '@tabler/icons-react-native';
import {convertCardToCashPaymentLocalTransaction, convertCardToCashPaymentOnlineTransaction, convertCardToUPIPaymentLocalTransaction, convertCardToUPIPaymentOnlineTransaction } from "@/services/orders.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@backpackapp-io/react-native-toast";

const QRCodeModal = ({
  label,
  show = false,
  onClose,
  qrData,
  onSuccess,
  price,
  seat,
  disableDoneButton = false,
  canEdit = false,
  setComments,
  showTrxId = false,
  AllowCashPayment = false,
  AllowUPIPayment = false,
  apiData = {},
  type=""
}) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(show);
  const [isEditing, setIsEditing] = useState(false);

  // const mobileNumber = qrData?.split("number:")[1]?.split(",")[0];
  const receipt = qrData?.split("reciept:")[1]?.split(",")[0];
  const pnr = receipt?.split("::")[2];
  const orderCount = receipt?.split("::")[5]

  const CashPaymentLocalTransactionMutation = useMutation({
    mutationKey: ["cash-payment"],
    mutationFn: (paymentDetails) => convertCardToCashPaymentLocalTransaction(paymentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Payment Done successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error converting card to cash payment:", error);
      toast.error("Failed to convert card to cash payment");
    },
  });

  const UPIPaymentLocalTransactionMutation = useMutation({
    mutationKey: ["upi-payment"],
    mutationFn: (paymentDetails) => convertCardToUPIPaymentLocalTransaction(paymentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Payment Done successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error converting card to UPI payment:", error);
      toast.error("Failed to convert card to UPI payment");
    },
  })

    const CashPaymentOnlineTransactionMutation = useMutation({
      mutationKey: ["cash-payment"],
      mutationFn: (paymentDetails) =>
        convertCardToCashPaymentOnlineTransaction(paymentDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["transactions", "online-transaction", "local-transactions"],
        });
        toast.success("Payment Done successfully");
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Error converting card to cash payment:", error);
        toast.error("Failed to convert card to cash payment");
      },
    });

  const UPIPaymentOnlineTransactionMutation = useMutation({
    mutationKey: ["upi-payment"],
    mutationFn: (paymentDetails) => convertCardToUPIPaymentOnlineTransaction(paymentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "online-transaction", "local-transactions"],
      });
      toast.success("Payment Done successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error converting card to UPI payment:", error);
      toast.error("Failed to convert card to UPI payment");
    },
  })

  useEffect(() => {
    setVisible(show);
  }, [show]);

  if (!visible) return null;

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  const handleCardToCashPayment = () => {
    if (type.toLocaleLowerCase() == "online_transactions") {
      CashPaymentOnlineTransactionMutation.mutate({
        apiData: apiData,
      });
    } else {
      CashPaymentLocalTransactionMutation.mutate({
        apiData: apiData,
      });
    }
  };

  const handleCardToUPIPayment = () => {
    if (type?.toLocaleLowerCase() == "online_transactions") {
      UPIPaymentOnlineTransactionMutation.mutate({
        apiData: apiData,
      });
    } else {
      UPIPaymentLocalTransactionMutation.mutate({
        apiData: apiData,
      });
    }
  };

  return (
    <View style={{ width: "100%", height: "100%", position: "absolute" }}>
      <Modal
        visible={visible}
        onRequestClose={() => {
          setIsEditing(false);
          onClose();
        }}
        presentationStyle="overFullScreen"
        animationType="fade"
        transparent
        style={styles.modalRoot}
      >
        <TouchableOpacity
          style={styles.root}
          // onPress={onClose}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.listContainer,
              ]}
            >
              <View style={styles.container}>
                <View
                  style={{
                    position: "relative",
                    width: "90%",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.title}>{label}</Text>
                  {canEdit && (
                    <TouchableOpacity
                      onPress={() => setIsEditing(!isEditing)}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      <IconBubbleText
                        size={SIZES.width * 0.055}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={qrData}
                    size={SIZES.width * 0.5}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>Total Price: ₹ {price}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.seatText}>Seat:</Text>
                    <Text style={[styles.seatText, { color: COLORS.primary }]}>
                      {" "}
                      {seat}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.seatText}>PNR:</Text>
                    <Text style={[styles.seatText, { color: COLORS.primary }]}>
                      {" "}
                      {pnr}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.seatText}>Order Count:</Text>
                    <Text style={[styles.seatText, { color: COLORS.primary }]}>
                      {" "}
                      {orderCount}
                    </Text>
                  </View>
                  {showTrxId && (
                    <View>
                      <Text style={[styles.seatText, { color: COLORS.primary, textAlign: "center" }]}>
                        {receipt}
                      </Text>
                    </View>
                  )}
                </View>

                {isEditing && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Add Comments"
                      value={qrData.reciept}
                      onChangeText={(text) => setComments(text)}
                      style={styles.input}
                    />
                  </View>
                )}

                <View style={styles.buttonGroup}>
                  {!disableDoneButton && (
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={handleSuccess}
                    >
                      <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                  )}

                  {AllowCashPayment && (
                    <TouchableOpacity
                      style={[styles.doneButton]}
                      onPress={() => {
                        handleCardToCashPayment();
                        setIsEditing(false);
                      }}
                    >
                      <Text
                        style={[styles.buttonText]}
                      >
                        Make Cash Payment
                      </Text>
                    </TouchableOpacity>
                  )}

                  {AllowUPIPayment && (
                    <TouchableOpacity
                      style={[styles.doneButton]}
                      onPress={() => {
                        handleCardToUPIPayment();
                        setIsEditing(false);
                      }}
                    >
                      <Text
                        style={[styles.buttonText]}
                      >
                        Make UPI Payment
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      onClose();
                      setIsEditing(false);
                    }}
                  >
                    <Text
                      style={[styles.buttonText, { color: COLORS.primary }]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 20,
    ...FONTS.h3,
    color: COLORS.primary,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
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
    backgroundColor: COLORS.shade1trans,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  listContainer: {
    // height: SIZES.height * 0.6,
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
  button: {
    ...FONTS.h5,
  },
  button1: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SIZES.padding * 1.5,
    width: SIZES.width * 0.7,
  },
  button2: {
    backgroundColor: COLORS.primary,
    borderRadius: 40,
    width: SIZES.width * 0.7,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  inputContainer: {
    marginTop: SIZES.padding,
    marginHorizontal: SIZES.padding * 2,
    width: "80%",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    fontSize: 16,
    color: COLORS.black,
    backgroundColor: COLORS.lightGray2,
    ...FONTS.h6,
  },

  errorContainer: {
    marginTop: 5,
    marginHorizontal: SIZES.padding * 2,
  },
  errorText: {
    ...FONTS.h6,
    color: COLORS.danger,
    fontSize: 14,
  },
  buttonGroup: {
    marginTop: 30,
    width: "80%",
    alignItems: "center",
  },

  doneButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: COLORS.lightGray2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    ...FONTS.h4,
    color: COLORS.white,
    textAlign: "center",
  },
  priceText: {
    marginTop: 20,
    ...FONTS.h4,
    color: COLORS.success, // or COLORS.primary depending on your theme
  },

  seatText: {
    marginTop: 5,
    ...FONTS.h5,
    color: COLORS.darkGray,
  },
  priceContainer: {
    alignItems: "center",
  },
});

export default QRCodeModal;
