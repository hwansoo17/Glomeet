import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputBox = ({ value, onChangeText, placeholder, style }) => {
  return (
    <TextInput
      style={[styles.input, style]} 
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
};
const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default InputBox;
