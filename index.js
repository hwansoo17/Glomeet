/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import pushNoti from "./pushNoti";
;


AppRegistry.registerComponent(appName, () => App);
