import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert} from 'react-native';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWebSocket } from "../../WebSocketProvider";
import { api } from '../../api';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const webSocketClient = useWebSocket();

  const login = async () => {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      const response = await api.post('/auth/signIn', {email, password, fcmToken})
      if (response.status == 200) {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('accessToken', response.data.accessToken)
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken)
        await webSocketClient.login();
        navigation.navigate('Root', {screen: 'Home'});
      }
    } catch (error) {
      if (error.response.status == 401) {
        console.log(error);
        Alert.alert('이메일 혹은 비밀번호가 일치하지 않습니다.');;
      }
    }
  };

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
      <TouchableOpacity
        onPress={() => navigation.navigate('Root')}>
        <Text>홈스크린</Text>
      </TouchableOpacity>
    </View>
  )
};

export default LoginScreen;
