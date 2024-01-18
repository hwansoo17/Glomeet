import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
const HomeMainScreen = ({navigation}) => {
  
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
        console.log('Email removed');
      });
      await AsyncStorage.removeItem('token').then(() => {
        console.log('Token removed');
      });
      navigation.replace('Auth');
      console.log('로그아웃 성공');
    } else {
      console.log('로그아웃 실패');
    }
  }
  return (
    <View>
      <Text>MainScreen</Text>
      <TouchableOpacity onPress={loggedOut}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeMainScreen;