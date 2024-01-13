import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import config from '../../config';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    
  login = async () => {
    const response = await fetch(config.SERVER_URL+'/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, password: password})
    });
    const data = await response.json();
    console.log(data);
  };

  console.log(email);
  console.log(password);
  return (
    <View>
      <TextInput 
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}/>
      <TextInput 
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}/>
      <TouchableOpacity
        onPress={login}>
        <Text>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('EmailAuth')}>
        <Text>회원가입</Text>
      </TouchableOpacity>
    </View>
  )
};

export default LoginScreen;