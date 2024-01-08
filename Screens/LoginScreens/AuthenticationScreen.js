import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

const AuthenticationScreen = ({navigation}) => {
  return (
    <View>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
        <TextInput placeholder="인증번호" />
        <TouchableOpacity onPress={() => navigation.navigate('PasswordRegister')}>
          <Text>인증번호 확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  
}

export default AuthenticationScreen;
