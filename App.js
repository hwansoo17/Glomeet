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

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[백그라운드에서 수신한 메시지]', remoteMessage);
    await pushNoti.displayNoti(remoteMessage);
});

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token')
    .then((value) => {
      if (value) {
        setInitialRoute('Root');
      } else {
        setInitialRoute('Auth');
      }
    })
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('[온 앱 메시지]',remoteMessage);
        pushNoti.displayNoti(remoteMessage);
    });
    return unsubscribe;
},[]);
useEffect(() => {
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log(token);
    // You can use the token or set it in the state here
  };

  getToken();
}, []);

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