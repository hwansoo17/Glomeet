/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import EventEmitter from "react-native-eventemitter";
import { navigate } from './RootNavigation';
import notifee from '@notifee/react-native';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("[백그라운드에서 수신한 메시지]", remoteMessage);
  EventEmitter.emit("backgroundMessage", remoteMessage);
});
messaging().onNotificationOpenedApp(async remoteMessage => {
  console.log('Notification caused app to open from background state:', remoteMessage);
  navigate('Chatting')
})
notifee.onBackgroundEvent(async({type, detail}) => {
  const { notification, pressAction } = detail;
  console.log("타입:", type, "프레스액션:",pressAction, "노티피케이션",notification, '백그라운드노티피')
})
AppRegistry.registerComponent(appName, () => App);
