import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useWebSocket } from "../../WebSocketProvider";
import { api, authApi } from '../../api'
const HomeMainScreen = ({navigation}) => {
  const webSocketClient = useWebSocket();
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
    </View>
  );
};

export default HomeMainScreen;
