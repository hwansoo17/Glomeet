import React from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';

const LoginScreen = ({navigation}) => {
  return (
    <View>
      <TextInput placeholder="이메일"/>
      <TextInput placeholder="비밀번호"/>
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
