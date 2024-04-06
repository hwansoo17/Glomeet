import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const LineInput = ({ value, onChangeText, placeholder, style }) => {
  return (
    <TextInput
      style={[styles.input, style]} 
      value={value}
      secureTextEntry
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
};

// 기본 스타일 설정
const styles = StyleSheet.create({
  input: {
        fontFamily: 'Pretendard-Regular',
        height: 50,
        borderBottomWidth: 1.2,
        borderColor: '#887E7E', 
}
});

export default LineInput;