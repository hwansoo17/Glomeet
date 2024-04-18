import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
const HomeMain = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.replace('Auth')}>
        <Text>로그인 화면으로(임시)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
        <Text>프로필수정</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeMain;
