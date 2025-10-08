import React, { useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type CustomBackdropProps = {
  animatedIndex: SharedValue<number>;
  animatedPosition: SharedValue<number>;
  appearsOnIndex?: number;
  disappearsOnIndex?: number;
  opacity?: number;
  closeOnPress?: boolean;
  style?: StyleProp<ViewStyle>;
  onClose: () => void;
};

const CustomBackdrop = ({
  animatedIndex,
  appearsOnIndex = 0,
  disappearsOnIndex = -1,
  opacity = 0.5,
  closeOnPress = true,
  style,
  onClose
}: CustomBackdropProps) => {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      animatedIndex.value,
      [disappearsOnIndex, appearsOnIndex],
      [0, opacity]
    );

    return {
      opacity: interpolatedOpacity,
      backgroundColor: 'black'
    };
  });

  const pointerEvents = closeOnPress ? 'auto' : 'none';

  if (closeOnPress) {
    return (
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle, style]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          pointerEvents="auto"
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      pointerEvents={pointerEvents}
      style={[StyleSheet.absoluteFillObject, animatedStyle, style]}
    />
  );
};

export default CustomBackdrop;
