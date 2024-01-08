import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

const RegisterScreen = ({navigation}) => {
  return (
    <View>
      <TextInput placeholder="이름" />
      <View style={{flexDirection:'row', alignItems: 'center'}}>
        <TextInput placeholder="이메일" />
        <TouchableOpacity onPress={() => navigation.navigate('Authentication')}>
          <Text>인증번호 받기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  
}; 

export default RegisterScreen;