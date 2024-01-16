import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert} from 'react-native';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    
  const login = async () => {
    try {
      const response = await fetch(config.SERVER_URL+'/auth/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, password: password})
      });
      if (response.status == 200) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.token)
        .then(() => {
          console.log('Token saved');
        })
        navigation.reset({ routes: [{ name: 'Root' }],
        });
      } else {
        Alert.alert('이메일 혹은 비밀번호가 일치하지 않습니다.');
      }
      console.log(response.status)
    } catch (e) {
      console.log(e);
    }
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
        secureTextEntry
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