import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

const PasswordRegisterScreen = () => {
  return (
    <View>
      <TextInput placeholder="비밀번호" />
      <TextInput placeholder="비밀번호확인" />
      <TouchableOpacity>
        <Text>회원가입</Text>
      </TouchableOpacity>
    </View>
  )
  
}

export default PasswordRegisterScreen;