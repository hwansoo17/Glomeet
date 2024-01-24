import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthStackScreen from './Screens/StackScreens/AuthStackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeStackScreen from './Screens/StackScreens/HomeStackScreen';
import MatchingStackScreen from './Screens/StackScreens/MatchingStackScreen';
import MeetingStackScreen from './Screens/StackScreens/MeetingStackScreen';
import ChattingStackScreen from './Screens/StackScreens/ChattingStackScreen';
import messaging from '@react-native-firebase/messaging';
import pushNoti from "./pushNoti";
import config from './config';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[백그라운드에서 수신한 메시지]', remoteMessage);
  await pushNoti.displayNoti(remoteMessage.data.title, remoteMessage.data.body);
});
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen 
      name="홈" 
      component={HomeStackScreen}
      options={{ headerShown: false }} />
      <Tab.Screen 
      name="매칭" 
      component={MatchingStackScreen}
      options={{ headerShown: false }} />
      <Tab.Screen 
      name="미팅" 
      component={MeetingStackScreen}
      options={{ headerShown: false }} />
      <Tab.Screen 
      name="채팅" 
      component={ChattingStackScreen}
      options={{ headerShown: false }} />
    </Tab.Navigator>
  )
};

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
    const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    // const apnsToken = await messaging().getAPNSToken(); 이거 원래 쓴다는데 이거 안쓰고도 됨;
  if (enabled) {
      const fcmToken = await messaging().getToken();
      console.log('fcmtoken: ' + fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
    } else {
      console.log('알림 비활성화한 유저');
    }
}

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  requestUserPermission();
  const checkLoginStatus = async () => {
     
    const email = await AsyncStorage.getItem('email');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    //엑세스 토큰이 있으면 토큰 유효성 검사
    console.log('액세스토큰'+accessToken);
    if (accessToken) {
      const response = await fetch(config.SERVER_URL+'/token/checkToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+accessToken
        }
      });
      console.log('액세스토큰 유효성 여부'+response.status);
      //토큰이 유효하면 이니셜 라우트를 홈으로 설정(자동 로그인)
      if (response.status == 200) {
        setInitialRoute('Root');
      } else {
        //토큰이 유효하지 않으면 토큰 재발급 시도
        const response = await fetch(config.SERVER_URL+'/token/re-issue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: email, refreshToken: refreshToken})
        });
        console.log('토큰재발급 성공 여부'+response.status);
        //토큰 재발급 성공하면 토큰 저장하고 함수 재실행
        if (response.status == 200) {
          const data = await response.json();
          await AsyncStorage.setItem('accessToken', data.accessToken);
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
          checkLoginStatus();
        } else {
          //토큰 재발급 실패하면 로그인 화면으로 이동
          console.log('토큰 재발급 실패');
          setInitialRoute('Auth');
        };
      };
    } else {
      //엑세스 토큰이 없으면 로그인 화면으로 이동
      console.log('엑세스 토큰 없음');
      setInitialRoute('Auth');
    };
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('[온 앱 메시지]',remoteMessage);
        pushNoti.displayNoti(remoteMessage.data.title, remoteMessage.data.body);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem('fcmToken', fcmToken);  
        return;
      }
    getFcmToken();
  }, [])

  if (initialRoute === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
        name="Root" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}/>
        <Stack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;