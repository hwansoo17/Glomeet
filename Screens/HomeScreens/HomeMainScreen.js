import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useWebSocket } from "../../WebSocketProvider";
import { api, authApi } from '../../api'
const HomeMainScreen = ({navigation}) => {
  const webSocketClient = useWebSocket();
  const getMyMeeting = async () => {
    try {
      const response = await authApi.post('/meeting/my')
      if (response.status == 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error.response.status)
    }
  }
  const getMyMeetingData = async () => {
    try {
      const response = await authApi.post('/meeting/chat')
      if (response.status == 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error.response.status)
    }
  }
  const loggedOut = async () => {
    const email = await AsyncStorage.getItem('email');
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    try {
      const response = await api.post('/auth/signOut', {email: email, fcmToken: fcmToken})
      if (response.status == 200) {
        await AsyncStorage.removeItem('email')
        await AsyncStorage.removeItem('accessToken')
        await webSocketClient.logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }]
        });
      };
    } catch (error) {
     console.error(error.response.status);
    }; 
  };
  return (
    <View>
      <Text>MainScreen</Text>
      <TouchableOpacity 
      onPress={() => loggedOut()}
      >
        <Text>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace('Auth')}>
        <Text>로그인 화면으로(임시)</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={getMyMeeting}
      >
        <Text>미팅 아이디 가져오기</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={getMyMeetingData}
      >
        <Text>미팅 데이터 가져오기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeMainScreen;
