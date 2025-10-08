import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { IconMinus, IconPlus } from "@tabler/icons-react-native";

const Counter = ({ start = 0, max, min = 0, step = 1, onChange, editable = true, initialOpening = 0 }) => {

  const [value, setValue] = useState(start);

  const onChangeValue = async (v) => {
    let actualValue = ("" + v).replace(/[,a-zA-Z]/g, "");
    const val = actualValue || 0;
    if (val >= min) {
      if (max + initialOpening > 0) {
        if (val <= max + initialOpening) {
          await setValue(val);
          onChange?.(val);
        }
      } else {
        await setValue(val);
        onChange?.(val);
      }
    }
  };

  const increase = () => {
    if (max + initialOpening > value) {
      onChangeValue(parseFloat(value) + step);
    }
  };

  const decrease = () => {
    onChangeValue(parseFloat(value) - step);
  };

  useEffect(() => {
    setValue(start);
  }, []); // Only on mount

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={value <= min}
        style={value > min ? styles.iconStyle : styles.iconDisabledStyle}
        onPress={decrease}
      >
        <IconMinus
          size={22}
          color={value > min ? COLORS.primary : COLORS.shade1}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.countText}
        value={String(value)}
        onChangeText={onChangeValue}
        keyboardType="decimal-pad"
        editable={editable}
      />
      <TouchableOpacity
        style={
          max + initialOpening > value
            ? styles.iconStyle
            : styles.iconDisabledStyle
        }
        onPress={increase}
        disabled={max + initialOpening <= value}
      >
        <IconPlus size={22} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: SIZES.base,
    borderRadius: 4,
  },
  iconStyle: {
    padding: SIZES.base,
    borderRadius: 4,
    backgroundColor: COLORS.secondaryLight,
  },
  iconDisabledStyle: {
    padding: SIZES.base,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
  },
  countText: {
    ...FONTS.h5,
    color: COLORS.black2,
    minWidth: SIZES.padding * 4,
    textAlign: "center",
    paddingHorizontal: SIZES.padding / 2,
    paddingVertical: SIZES.padding / 2,
    // backgroundColor: 'transparent',
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: COLORS.primary2,
  },
});

export default Counter;
