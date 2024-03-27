import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useWebSocket } from "../../WebSocketProvider";
import { api, authApi } from '../../api'
import { Button } from '../../CustomComponent';
import Homemain from "../../assets/homemain.svg";
import Bell from "../../assets/bell.svg";
const HomeMainScreen = ({navigation}) => {
  const webSocketClient = useWebSocket();
  const getMyMeeting = async () => {
    try {
      const response = await authApi.post('/meeting/my')
      if (response.status == 200) {
        // console.log(response.data);
      }
    } catch (error) {
      console.error(error.response.status)
    }
  }
  const getMyMeetingData = async () => {
    try {
      const response = await authApi.post('/meeting/list')
      if (response.status == 200) {
        // console.log(response.data);
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
  const TEXTS = {
    TITLE: ['귀여운 다은님'," "],
    SUBTITLE: ['안녕하세요!','오늘도 친구 만나러 가볼까요?'],
    BUTTON_TEXT: '다음으로 넘어가기',
  };
  return (
    <View style={styles.container}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: 1 }}/>
      <View style={{ flex: 8 }}>
        <View style={{ flex: 1,flexDirection: 'row'}}>
          <View style ={{ flex: 8, alignItems: 'center' ,justifyContent: 'center' ,flexDirection: 'row'}}>
              <Text style={styles.noBoldTitle}>{TEXTS.SUBTITLE[0]}</Text>
              <Text style={styles.title}>{TEXTS.TITLE[1]}</Text>
              <Text style={styles.title}>{TEXTS.TITLE[0]}</Text>
          </View> 
          <View style ={{flex: 1, alignItems: 'center',flexDirection: 'row'}}>
            <Bell/>
          </View>  
        </View>  
        <Text style={styles.subtitle}>{TEXTS.SUBTITLE[1]}</Text>  
        <View style={{ flex: 8 ,alignItems: 'center' }}> 
          <Homemain 
          style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
          />

          <View>
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
    backgroundColor: '#5782F1',
  },
  imgcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  textContainer:{
    flexDirection: 'row', 
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  noBoldTitle:{
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  textstyle : {
    fontSize: 13,
    textAlign: 'center',
    color: '#3B3B3B',
  },
  subtitle: {
    textAlign: 'center',
    color: '#fff',


  },
  activeTextStyle: {
    color: 'white', // 활성화된 아이템의 텍스트 색상 변경
  },
});


export default HomeMainScreen;
