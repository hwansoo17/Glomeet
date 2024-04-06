import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const MainButton = ({ title, onPress, style, textStyle, disabled }) => {
    return (
      <TouchableOpacity 
          style={[styles.button, style, disabled ? styles.disabledButton : {}]} 
          onPress={onPress}
          disabled={disabled}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5782F1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  disabledButton: {
    backgroundColor: '#D8D8D8'
  },

  buttonText: {
    fontFamily: 'Pretendard-Bold',
    color: '#ffffff',
    fontSize: 18,
  },
});

export default MainButton;