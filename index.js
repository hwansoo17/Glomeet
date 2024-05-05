/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import EventEmitter from "react-native-eventemitter";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("[백그라운드에서 수신한 메시지]", remoteMessage);
  EventEmitter.emit("backgroundMessage", remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
