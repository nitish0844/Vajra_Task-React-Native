import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

const OpacityPressable = ({ children, style, onPress, ...props }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[style, { opacity: pressed ? 0.5 : 1 }]}
      {...props}
    >
      {children}
    </Pressable>
  );
};

export default OpacityPressable;
