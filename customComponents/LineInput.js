import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const LineInput = ({ value, onChangeText, placeholder, style, secureTextEntry = false, editable, maxLength, multiline}) => {
  return (
    <TextInput
      style={[styles.input, style]} 
      value={value}
      secureTextEntry = {secureTextEntry}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={"#868686"}
      maxLength={maxLength}
      multiline={multiline}
      editable={editable}
    />
  );
};

// 기본 스타일 설정
const styles = StyleSheet.create({
  input: {
    color:'#000',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    paddingVertical:10,
    borderBottomWidth: 1.2,
    borderColor: '#F0EFF2', 
    paddingLeft: -2
}
});

export default LineInput;