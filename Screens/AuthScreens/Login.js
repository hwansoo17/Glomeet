import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert, Image, ScrollView,SafeAreaView} from 'react-native';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWebSocket } from "../../WebSocketProvider";
import { api } from '../../api';
import Logo from '../../assets/Glomeet_logo.svg';
import MainButton from '../../customComponents/MainButton';
import LineInput from '../../customComponents/LineInput';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const webSocketClient = useWebSocket();
  const login = async () => {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      const response = await api.post('/auth/signIn', {email, password, fcmToken})
      if (response.status == 200) {
        console.log('로그인 성공: ', response.data)
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('nickName', response.data.nickName)
        await AsyncStorage.setItem('accessToken', response.data.tokens.accessToken)
        await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        await webSocketClient.login();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Root' }]
        });
      }
      if (response.status == 201) {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('nickName', response.data.nickName)
        await AsyncStorage.setItem('accessToken', response.data.tokens.accessToken)
        await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        await webSocketClient.login();
        navigation.reset({
          index: 0,
          routes: [{ name: 'OnBoard' }]
        });
      }
    } catch (error) {
      console.log(error.response)
      if (error.response.status == 401) {
        console.log('로그인 실패: ', error);
        Alert.alert('이메일 혹은 비밀번호가 일치하지 않습니다.');;
      }
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex:1}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex:1}}/>
            <View style={{flex:8}}>
              <View style={{height: 10}}/>
              <View style={{alignItems: 'center'}}>
                <Logo width={120} height={120}/>
                <Text style={{fontFamily: 'GmarketSansMedium', fontSize: 18, textAlign: 'center', lineHeight: 24, color: '#000'}}><Text style={{fontFamily: 'GmarketSansBold'}}>유학생</Text>들을 위한{'\n'}취미기반 매칭서비스 <Text style={{fontFamily: 'GmarketSansBold', color: '#5782F1'}}>글로밋</Text></Text>  
              </View>
              <View style={{height: 20}}/>
              <LineInput 
                placeholder="이메일을 입력하세요"
                value={email}
                secureTextEntry ={false}
                onChangeText={setEmail}
              />
              <View style={{height: 10}}/>
              <LineInput 
                placeholder="비밀번호를 입력하세요"
                value={password}
                secureTextEntry ={true}
                onChangeText={setPassword}
              />
              <View style={{height: 20}}/>
              <MainButton onPress={login} title={'로그인'}/>
              <View style={{height: 20}}/>
              <MainButton
                style={{backgroundColor: 'white', borderColor: '#5782F1', borderWidth:1.2}}
                textStyle={{color: '#5782F1'}}
                title={'회원가입'}
                onPress={() => navigation.navigate('Register1')}/>
              <View style={{height: 10}}/>
              <TouchableOpacity
                style={{padding:10}}
                onPress={() => navigation.navigate('PasswordReset1')}>
                <Text style={styles.linkText}>비밀번호를 잊으셨나요?</Text>
              </TouchableOpacity>
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
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
  },
  input: {
    fontFamily: 'Pretendard-Regular',
    height: 50,
    borderBottomWidth: 1.2,
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
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    color: '#868686',
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
