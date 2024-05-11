import React, { useEffect, useState, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from './RootNavigation';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AuthStackScreen from "./Screens/StackScreens/AuthStackScreen";
import OnBoardingStackScreen from "./Screens/StackScreens/OnBoardingStackScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeStackScreen from "./Screens/StackScreens/HomeStackScreen";
import MatchingStackScreen from "./Screens/StackScreens/MatchingStackScreen";
import MeetingStackScreen from "./Screens/StackScreens/MeetingStackScreen";
import ChattingStackScreen from "./Screens/StackScreens/ChattingStackScreen";
import messaging from "@react-native-firebase/messaging";
import pushNoti from "./pushNoti";
import { WebSocketProvider } from "./WebSocketProvider";
import { authApi } from "./api"
import { navigate } from './RootNavigation';
import EventEmitter from "react-native-eventemitter";
import {LogBox} from "react-native"
import { Platform } from "react-native";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import HomeIcon from "./assets/Glomeet_logo.svg"
import MatchingIcon from "./assets/MatchingIcon.svg";
import MeetingIcon from "./assets/MeetingIcon.svg";
import ChattingIcon from "./assets/ChattingIcon.svg";

export const AppContext = createContext();
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log("[백그라운드에서 수신한 메시지]", remoteMessage);
//   //await pushNoti.displayNoti(remoteMessage.data.title, remoteMessage.data.body);
//   EventEmitter.emit("backgroundMessage", remoteMessage);
// });

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              width="28" 
              height="28"
              color={focused? "#5782F1" : "#949698"}
            />
          ),
          tabBarLabel: "홈",
          tabBarLabelStyle: {fontFamily:"GmarketSansTTFMedium", fontSize:12}
        }} 
      />
      <Tab.Screen
        name="Matching"
        component={MatchingStackScreen}
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ focused }) => (
            <MatchingIcon
              width="28" 
              height="28"
              color={focused? "#5782F1" : "#949698"}
            />
          ),
          tabBarLabel: "매칭",
          tabBarLabelStyle: {fontFamily:"GmarketSansTTFMedium", fontSize:12}
        }} 
      />
      <Tab.Screen
        name="Meeting"
        component={MeetingStackScreen}
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ focused }) => (
            <MeetingIcon
              width="28" 
              height="28"
              color={focused? "#5782F1" : "#949698"}
            />
          ),
          tabBarLabel: "미팅",
          tabBarLabelStyle: {fontFamily:"GmarketSansTTFMedium", fontSize:12}
        }}  
      />
      <Tab.Screen
        name="Chatting"
        component={ChattingStackScreen}
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ focused }) => (
            <ChattingIcon
              width="28" 
              height="28"
              color={focused? "#5782F1" : "#949698"}
            />
          ),
          tabBarLabel: "채팅",
          tabBarLabelStyle: {fontFamily:"GmarketSansTTFMedium", fontSize:12}
        }}
      />
    </Tab.Navigator>
  );
};

const requestUserPermissionAos= async() => {
  if (Platform.OS === 'android') {
    // Android 권한 요청 (특히 Android 13 이상)
    try {
      const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        console.log("권한이 허용되었습니다.")
      }
    } catch (e) {
      Alert.alert("권한이 거부되었습니다.");
      console.warn(err);
    }
  }
}
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  // const apnsToken = await messaging().getAPNSToken(); 이거 원래 쓴다는데 이거 안쓰고도 됨;
  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log("fcmtoken: " + fcmToken);
    await AsyncStorage.setItem("fcmToken", fcmToken);
  } else {
    console.log("알림 비활성화한 유저");
  }
}

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  const checkLoginStatus = async () => {
    await requestUserPermission();
    const accessToken = await AsyncStorage.getItem("accessToken");
    //엑세스 토큰이 있으면 토큰 유효성 검사
    if (accessToken) {
      try {
        const response = await authApi.post("/token/checkToken");
        if (response.status == 200) {
        // 토큰이 유효하면 이니셜 라우트를 홈으로 설정(자동 로그인)
        setInitialRoute("Root");
        }
      } catch (error) {
        setInitialRoute("Auth");
      }
    } else {
      //엑세스 토큰이 없으면 로그인 화면으로 이동
      setInitialRoute("Auth");
    }
  };
  
  useEffect(() => {
    checkLoginStatus()
    requestUserPermissionAos()
    // LogBox.ignoreAllLogs()
  }, []);
  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("[온 앱 메시지]", remoteMessage);
      if (remoteMessage.data.requestType == 'matching') { //매칭완료 알림일때만 이벤트 쏴주기
      EventEmitter.emit("matchingSuccess", remoteMessage);
      pushNoti.displayNoti(remoteMessage.notification.title, remoteMessage.notification.body);
      }
    });
    return unsubscribe;
  }, []);

  if (initialRoute === null) {
    return null;
  }

  return (
    <WebSocketProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="Auth"
            component={AuthStackScreen}
            options={{ headerShown: false }} />
            <Stack.Screen
            name="OnBoard"
            component={OnBoardingStackScreen}
            options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </WebSocketProvider>
  );
};

export default App;
