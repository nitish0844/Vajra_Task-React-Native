import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

interface ButtonProps {
  small?: boolean;
  color?: string;
  text: string;
  action?: () => void;
  textColor?: string;
  underlayColor?: string;
  textStyle?: any;
  hasBorder?: boolean;
  containerStyle?: any;
  icon?: any;
  iconSize?: number;
  rightIcon?: boolean;
  lightBoxMode?: boolean;
}

function SimpleButton({
  small,
  color,
  text,
  action = () => null,
  textColor,
  underlayColor,
  textStyle = {},
  hasBorder,
  containerStyle = {},
  icon,
  iconSize,
  rightIcon = false,
  lightBoxMode = false,
}:ButtonProps) {
  if (textColor) textStyle = { ...textStyle, color: textColor };

  if (color) {
    containerStyle = {
      ...containerStyle,
      backgroundColor: color,
    };
  }

  if (hasBorder) {
    containerStyle = {
      borderWidth: 1.2,
      borderColor: textColor,
      ...containerStyle,
    };
  }

  let Parent = TouchableOpacity,
    parentProps = {};
  if (!lightBoxMode) {
    Parent = TouchableOpacity;
    parentProps = {
      activeOpacity: 0.75,
      onPress: action,
      underlayColor: underlayColor || COLORS.successDark || 'white',
    };
  } else {
    /**
     * Lightbox mode doesn't support touchable components, hence normal View is used
     */
    Parent = View as any;
  }

  return (
    <Parent
      style={[styles.button, small ? styles.buttonSmall : null, containerStyle]}
      {...parentProps}>
      <View
        style={[
          styles.buttonWrapper,
          rightIcon ? { flexDirection: 'row-reverse' } : {},
        ]}>
        {/* {icon && iconSize ? (
          <Icon name={icon} size={iconSize} color={textColor} />
        ) : null} */}
        <Text
          style={[
            styles.textStyle,
            small ? styles.smallText : null,
            textStyle,
            icon && iconSize ? { marginLeft: 4 } : {},
          ]}>
          {text}
        </Text>
      </View>
    </Parent>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 44,
    width: 160,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  buttonSmall: {
    height: 28,
    width: 120,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textStyle: {
    ...FONTS.h5,
    marginTop: 2,
  },
  smallText: {
    ...FONTS.h6,
  },
});

export default memo(SimpleButton);
