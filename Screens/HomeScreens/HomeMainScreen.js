import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeMainScreen = ({navigation}) => {
  const loggedOut = async () => {
    await AsyncStorage.removeItem('token').then(() => {
      console.log('Token removed');
      
    });
    navigation.replace('Auth');
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