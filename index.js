/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import pushNoti from "./pushNoti";
;
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[백그라운드에서 수신한 메시지 입니다]', remoteMessage);
    pushNoti.displayNoti(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
