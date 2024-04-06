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

// 기본 스타일 설정
const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default InputBox;
