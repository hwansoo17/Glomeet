import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding1 from "../../assets/onboarding1.svg";
import { Button,InputBox } from '../../CustomComponent';

const OnBoarding1 = ({ navigation }) => {
  const [nickName, setNickName] = useState('');

  const saveNickName = async () => {
    await AsyncStorage.setItem('nickName', nickName);
    navigation.navigate('OnBoarding2');
  };

  const TEXTS = {
    TITLE: ['반가워요!'],
    SUBTITLE: ['프로필을 선택 후 이름을 입력해 주세요'],
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 8 }}>
          <View style={{ flex: 1 }}/>
          <View style={{ flex: 8 }}>
            <Onboarding1/>
            <View style={{ height: 20 }} />
            <Text style={styles.title}>{TEXTS.TITLE[0]}</Text>
            <Text style={styles.subtitle}>{TEXTS.SUBTITLE[0]}</Text>
            <View style={{ height: 20 }} />
            <InputBox 
                value={nickName}
                onChangeText={setNickName}
                style={styles.input}
                placeholder="닉네임을 입력해 주세요"
                customStyle={{ borderColor: '#fff',}}
              />
            <View style={{ height: 10 }} />
            <Button title= "다음으로 넘어가기" onPress={saveNickName} textStyle={{fontWeight: 'bold'}}/>
          </View>
          <View style={{ flex: 1 }}/>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  item: {
    height:40,
    borderBottomWidth: 1,
    borderColor: '#868686',
    backgroundColor: '#ECE9E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color:"#868686"  
  },
  isButtonActive: {
    backgroundColor: '#5782F1',
  },
  button: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#5782F1',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  textstyle : {
    fontSize: 13,
    textAlign: 'center',
    color: '#3B3B3B',
  },
  subtitle: {
    textAlign: 'center',
    fontSize:15,
  
  },
  activeTextStyle: {
    color: 'white', // 활성화된 아이템의 텍스트 색상 변경
  },
  });
  
export default OnBoarding1;

