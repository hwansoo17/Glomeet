import React from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';


const LoginScreen = ({navigation}) => {
  return (
    <View>
      <TextInput placeholder="email"/>
      <TextInput placeholder="password"/>
      <TouchableOpacity>
        <Text>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => navigation.navigate('Register')}>
        <Text>회원가입</Text>
      </TouchableOpacity>
    </View>
  )
};

export default LoginScreen;