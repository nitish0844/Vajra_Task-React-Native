import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@backpackapp-io/react-native-toast";
import { IconEye, IconEyeOff, IconRecycle } from "@tabler/icons-react-native";

import { COLORS, FONT_FAMILY, FONTS, SIZES } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { patchAPI } from "@/services/apiCall/patchAPI";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

const DEFAULT = {
  newPassword: { value: "", secure: true },
  confirmNewPassword: { value: "", secure: true },
};

const ChangePasswordContainer = ({ handleClose }) => {
  const { auth, resetAuth } = useAuthStore();
  const [data, setData] = useState(DEFAULT);

  const updatePasswordMutation = useMutation({
    mutationKey: "updatePassword",
    mutationFn: (body) => {
      // console.log(">>", ["user/" + auth.id + "/change-password", { body }]);
      return patchAPI(`user/${auth.id}/change-password`, { body });
    },
    onSuccess: (e) => {
      // resetAuth();
      toast.success("Password Updated");
      handleClose();
    },
    onError: (e) => {
      // console.log("❌❌❌", e);
      toast.error(e?.message || "Something went wrong");
    },
  });
  
  const onSubmitCallback = () => {
    if (Object.keys(data).every((el) => String(data[el]?.value).trim() != "")) {
      
      if (data.newPassword.value == data.confirmNewPassword.value) {
        // console.log("🤨", {
        //   user_password: String(data.newPassword.value).trim(),
        // });
        updatePasswordMutation.mutate({
          user_password: String(data.newPassword.value).trim(),
        });
      } else {
        toast.error("Passwords doesn't match");
      }
    } else {
      toast.error("Enter valid password");
    }
  };

  const onChangeTextCallback = (key, value) => {
    setData((e) => {
      return { ...e, [key]: { ...e[key], value } };
    });
  };
  const onChangeSecureCallback = (key) => {
    setData((e) => {
      return { ...e, [key]: { ...e[key], secure: !e?.[key].secure } };
    });
  };

  return (
    <View style={styles.container}>
      {/* title */}
      <View style={{ width: "100%", flexDirection: "row" }}>
        <IconRecycle color={"black"} style={{ marginRight: 10 }} />
        <Text style={{ ...FONTS.h4 }}>Change Password</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              value={data.newPassword.value}
              onChangeText={(e) => {
                onChangeTextCallback("newPassword", e);
              }}
              autoCapitalize="none"
              secureTextEntry={data.newPassword.secure}
              placeholder="New Password"
              placeholderTextColor={COLORS.shade2trans}
              style={styles.input}
              autoComplete="off"
              autoCorrect={false}
            />
            <Pressable
              style={styles.passwordToggle}
              onPress={() => {
                onChangeSecureCallback("newPassword");
              }}
            >
              {!data.newPassword.secure ? (
                <IconEye color={COLORS.black1} strokeWidth={1.5} />
              ) : (
                <IconEyeOff color={COLORS.black1} strokeWidth={1.5} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              value={data.confirmNewPassword.value}
              onChangeText={(e) => {
                onChangeTextCallback("confirmNewPassword", e);
              }}
              secureTextEntry={data.confirmNewPassword.secure}
              placeholder="Confirm New Password"
              autoCapitalize="none"
              placeholderTextColor={COLORS.shade2trans}
              style={styles.input}
              autoComplete="off"
              autoCorrect={false}
            />
            <Pressable
              style={styles.passwordToggle}
              onPress={() => {
                onChangeSecureCallback("confirmNewPassword");
              }}
            >
              {!data.confirmNewPassword.secure ? (
                <IconEye color={COLORS.black1} strokeWidth={1.5} />
              ) : (
                <IconEyeOff color={COLORS.black1} strokeWidth={1.5} />
              )}
            </Pressable>
          </View>
        </View>

        <TouchableOpacity onPress={onSubmitCallback} style={styles.button}>
          {/* <Text style={[styles.label,{color:'black'}]}>Change Password</Text> */}
          {updatePasswordMutation.isPending ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.buttonText}>Updating...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  inputContainer: {
    width: "100%",
    minHeight: 50,
    flexDirection: "column",
  },
  input: {
    ...FONTS.body5,
    height: 60,
    borderColor: COLORS.shade4,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding * 2,
    marginBottom: SIZES.padding * 2,
  },
  labelText: {
    ...FONTS.body5,
    color: COLORS.shade7trans,
    paddingLeft: SIZES.padding * 2,
  },
  errorText: {
    ...FONTS.body6,
    color: COLORS.shade7trans,
    paddingLeft: SIZES.padding * 2,
    marginBottom: SIZES.padding,
  },
  passwordToggle: {
    position: "absolute",
    right: SIZES.padding / 2,
    top: SIZES.padding / 2,
    // margin: SIZES.padding / 2,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: SIZES.padding,
    // backgroundColor: 'rgba(255,255,255, 0.15)',
    borderRadius: SIZES.radius,
  },
  button: {
    height: 60,
    width: SIZES.width * 0.9,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonText: {
    ...FONTS.body4,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.primary,
  },
  label: {
    ...FONTS.body5,
    color: COLORS.shade2,
    marginBottom: SIZES.padding / 4,
  },
});

export default ChangePasswordContainer;
