import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert, Image, ScrollView} from 'react-native';
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
        console.log(response.data, '이거니?')
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('accessToken', response.data.accessToken)
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken)
        await webSocketClient.login();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Root' }]
        });
      }
      if (response.status == 201) {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('accessToken', response.data.accessToken)
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken)
        await webSocketClient.login();
        navigation.reset({
          index: 0,
          routes: [{ name: 'OnBoard' }]
        });
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
        <ScrollView style={{flex:1}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex:1}}/>
            <View style={{flex:8}}>
              <View style={{height: 10}}/>  
              <View style={styles.imageContainer}>
                <Image 
                  source={require('../../assets/ajou_logo.png')}
                  style={styles.imageStyle}
                  accessibilityRole="image"
                  accessibilityLabel="아주대학교 로고"
                  resizeMode="contain"
                />
              </View>
              <View style={{height: 10}}/> 
              <TextInput
                style={styles.input}
                placeholder="이메일을 입력하세요"
                value={email}
                onChangeText={setEmail}
              />
              <View style={{height: 10}}/> 
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={{height: 10}}/> 
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}/>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('PasswordReset1')}>
                  <Text>비밀번호 재설정</Text>
                </TouchableOpacity>
              </View>
              <View style={{height: 10}}/> 
              <TouchableOpacity 
                style={styles.button}
                onPress={login}>
                <Text style={styles.buttonText}>로그인</Text>
              </TouchableOpacity>
              <View style={{height: 10}}/> 
              <TouchableOpacity
                style={[styles.button, {backgroundColor: 'white', borderColor: '#5782F1', borderWidth:1}]}
                onPress={() => navigation.navigate('Register1')}>
                <Text style={styles.linkText}>회원가입</Text>
              </TouchableOpacity>
              <View style={{height: 10}}/> 
              <TouchableOpacity 
                onPress={() => navigation.replace('Root')}>
                <Text>홈스크린</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('OnBoard')}>
                <Text>온보딩</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}/>
          </View>
        </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
  },
  input: { 
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#887E7E',
  },
  button: {
    height: 50,
    backgroundColor: '#5782F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#5782F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});

export default LoginScreen;
