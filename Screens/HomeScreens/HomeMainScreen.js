import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useWebSocket } from "../../WebSocketProvider";

const HomeMainScreen = ({navigation}) => {
  const webSocketClient = useWebSocket();

  const loggedOut = async () => {
    const email = await AsyncStorage.getItem('email');
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    const response = await fetch(config.SERVER_URL+'/auth/signOut', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, fcmToken: fcmToken})
    });
    if (response.status == 200) {
      await AsyncStorage.removeItem('email').then(() => {
      });
      await AsyncStorage.removeItem('accessToken').then(() => {
      });
      navigation.replace('Auth');
    } else {
    }
  }
  return (
    <><View>
      <Text>MainScreen</Text>
      <TouchableOpacity onPress={async () => {
        await loggedOut();
        await webSocketClient.logout();
      } }>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View><View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>로그인 화면으로(임시)</Text>
        </TouchableOpacity>
      </View></>
  );
};

export default HomeMainScreen;
