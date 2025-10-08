import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  // TouchableOpacity,
} from "react-native";
import { IconCircle, IconCircleCheck } from "@tabler/icons-react-native";
import { COLORS, SIZES, FONTS } from "../constants/theme";
import { toast, Toasts } from "@backpackapp-io/react-native-toast";
import { getAllUsersFromDB } from "@/services/master.service";
import { getPaymentExceptionReasonFromDB } from "@/services/orders.service";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import OptionsModal from "./OptionsModal";
import { useNavigation } from "@react-navigation/native";

const RadioButton = ({ item, selected, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.radioButtonContainer}
      onPress={() => onChange(item)}
    >
      {selected ? (
        <IconCircleCheck size={24} color={COLORS.primary} />
      ) : (
        <IconCircle size={24} color={COLORS.shade1} />
      )}
      <Text style={styles.radioButtonLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const PeerModal = ({ onClose }) => {
  const navigation = useNavigation();
  const [selectedReason, setSelectedReason] = useState();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [employeeModal, setEmployeeModal] = useState(false);

  const usersQuery = useQuery({
    enabled: Boolean(selectedRole?.value),
    queryKey: ['users', selectedRole?.value],
    queryFn: ({ queryKey }) => getAllUsersFromDB({ category: queryKey[1] })
  });

  const reasonsQuery = useQuery({
    queryKey: ['internal-reasons'],
    queryFn: () => getPaymentExceptionReasonFromDB({ internal: true }),
    gcTime: 1000 * 60 * 20, // 20 minutes
    staleTime: 1000 * 60 * 8, // 8 minutes
  });

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setSelectedUser(null);
  };

  const handleReasonSelection = (reason) => {
    setSelectedReason(reason);
  };

  const onSaveItems = () => {

    if (!selectedRole?.label || !selectedReason?.value || !selectedUser?.id) {
      toast("Please choose the correct info!");
      return;
    }

    navigation.navigate('checkout', {
      reason: selectedReason.value,
      role: selectedRole.value,
      user: selectedUser,
      internal_sales: true,
      internal_user_id: selectedUser?.id,
    });

    onClose();
    setSelectedRole(null);
    setSelectedReason(null);
  };

  const onCancelItems = () => {
    onClose();
    setSelectedRole(null);
    setSelectedReason(null);
    setSelectedUser(null);
  };

  const handleUserSelect = (d) => {
    setSelectedUser(d);
    setEmployeeModal(false);
  }

  return (
    <View style={styles.modalContent}>
      <Text style={styles.title}>Reason for Compliment?</Text>
      {(reasonsQuery.data || []).map((reason, index) => (
        <RadioButton
          key={index}
          item={reason}
          selected={selectedReason && selectedReason.value === reason.value}
          onChange={handleReasonSelection}
        />
      ))}
      <Text style={styles.title}>Complimentary For?</Text>
      <View>
        <RadioButton
          item={{ label: 'Cabin', value: 'Cabin' }}
          selected={selectedRole && selectedRole.value === 'Cabin'}
          onChange={handleRoleSelection}
        />
        <RadioButton
          item={{ label: 'Cockpit', value: 'Cockpit' }}
          selected={selectedRole && selectedRole.value === 'Cockpit'}
          onChange={handleRoleSelection}
        />
      </View>
      {selectedRole ? (
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setEmployeeModal(true)}
        >
          {selectedUser?.emp_name ? (
            <Text style={styles.dropdownButtonText}>
              {selectedUser.label}
            </Text>
          ) : (
            <Text style={styles.dropdownButtonText}>
              Choose {selectedRole.value} member
            </Text>
          )}
        </TouchableOpacity>
      ) : null}

      <OptionsModal
        show={employeeModal}
        label={`${selectedRole?.value} member`}
        options={usersQuery.data || []}
        onSelect={handleUserSelect}
        onClose={() => setEmployeeModal(false)}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          // disabled={!selectedRole?.label || !selectedReason?.value || !selectedUser?.id}
          onPress={onSaveItems}
          style={[styles.actionButton, styles.saveButton]}
        >
          <Text style={styles.saveButtonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancelItems}
          style={[styles.actionButton, styles.cancelButton]}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      {/* <Toasts /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding * 4,
    paddingBottom: SIZES.padding * 4,
    alignItems: "flex-start",
    position: "relative",
    width: '100%',
  },
  title: {
    ...FONTS.h3,
    fontSize: 20,
    marginBottom: SIZES.padding,
  },
  radioButtonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: SIZES.padding,
  },
  radioButtonLabel: {
    ...FONTS.h5,
    marginLeft: SIZES.padding,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.padding * 2,
    width: "100%",
    gap: SIZES.padding,
  },
  actionButton: {
    flex: 1,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: "center",
    paddingHorizontal: SIZES.padding * 3,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    // marginRight: 10,
  },
  cancelButton: {
    flex: 1,
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
  dropdownButton: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: "center",
    borderWidth: 1,
    width: "100%",
    borderColor: COLORS.shade1trans,
  },
  dropdownButtonText: {
    ...FONTS.body5,
    color: COLORS.black3,
  },
  modalTitleContainer: { padding: SIZES.padding, alignItems: 'center' },
  modalTitleText: { ...FONTS.h5 },
  optionItem: { paddingVertical: SIZES.padding, paddingHorizontal: SIZES.padding * 2, flexDirection: 'row' },
});

export default PeerModal;
