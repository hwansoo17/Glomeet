import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthStackScreen from './Screens/StackScreens/AuthStackScreen';
import messaging from '@react-native-firebase/messaging';
import {AsyncStorage} from 'react-native';
import {useEffect} from "react";
import pushNoti from "./pushNoti";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Home = () => null
const Profile = () => null
const Settings = () => null

function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  )
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[백그라운드에서 수신한 메시지]', remoteMessage);
    await pushNoti.displayNoti(remoteMessage);
});

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(true);
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
    React.useEffect(() => {
        console.log("이펙트시작");
        setTimeout(() => {
            setIsLoggedIn(false);
        }, 2000);
    },[]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
        <Stack.Screen 
        name="Root" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}/>
        ):(
        <Stack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{ headerShown: false }}/>)}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;