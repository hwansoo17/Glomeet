import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert, Image} from 'react-native';
import {StyleSheet} from 'react-native';
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
<View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/ajou_logo.png')} 
            style={styles.imageStyle}
            accessibilityRole="image"
            accessibilityLabel="아주대학교 로고"
            resizeMode="contain"
          />
        </View>
        <TextInput
          style={[styles.input, styles.email]}
          placeholder="이메일을 입력하세요"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, styles.password]}
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EmailAuth')}>
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Root')}>
          <Text style={styles.linkText}>홈스크린</Text>
        </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('PasswordReset')}>
        <Text>비밀번호 재설정</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('OnBoard')}>
        <Text>온보딩</Text>
      </TouchableOpacity>
    </View>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -10,
    color: '#887E7E',
  },
  email: {
    width: "80%",
    height: 50,
    marginBottom: 10,
    color: '#887E7E',
  },
  password: {
    height: 50,
    marginBottom: 10,
    color: '#887E7E',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#5782F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#5782F1',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'right',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});

export default LoginScreen;
