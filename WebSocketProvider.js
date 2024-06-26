import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StompJs from "@stomp/stompjs";
import config from "./config";
import EventEmitter from "react-native-eventemitter";
import {api} from "./api";
import pushNoti from "./pushNoti";
import messaging from '@react-native-firebase/messaging';

const WebSocketContext = createContext();
// let [webSocketClient, setWebSocketClient] = useRef(null);
let webSocketClient = null
// const client = useRef(null);
let subscription = null; // 토픽과 subscription 매핑을 위한 객체
const TextEncodingPolyfill = require("text-encoding");
Object.assign("global", {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

export const WebSocketProvider = ({ children }) => {
  const [blockedUsers, setBlockedUsers] = useState(["playground99@ajou.ac.kr", 'swoolee97@ajou.ac.kr'])
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    connectWebSocket()
    const appStateListener = AppState.addEventListener('change', fn_handleAppStateChange);
    return () => {
      // 사용자가 앱의 상태가 변경 되었을 경우 실행이 된다.
      appStateListener.remove()
      webSocketClient.deactivate();
  };

  }, []); //연결하는 부분

  const fn_handleAppStateChange = async(nextAppState) => {
    const email = await AsyncStorage.getItem("email")
    console.log("appState.current ::: ", appState.current, nextAppState);

    if (
      appState.current.match(/background/) &&
      nextAppState === 'active'
    ) {
      console.log('⚽️⚽️App has come to the foreground!');
      console.log(appState.current, nextAppState, '백에서 프론트');
      if (!webSocketClient.connected) {
        console.log('웹소켓 연결 상태: 연결되지 않음. 재연결을 시도합니다.');
        await connectWebSocket();
      }
      if (webSocketClient.connected) {
        console.log('웹소켓 연결 상태: 연결됨. 채널만 구독.');
        subscription = webSocketClient.subscribe("/sub/new-message/" + email, (message) => {
        handleWebSocketMessage(message);
        },{ 'email': email });
      }
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
      console.log('⚽️⚽️App has come to the background!');
      // subscription.unsubscribe();
      subscription.unsubscribe({"email" : email, "destination" : "/sub/new-message/"+email});
    }
    appState.current = nextAppState;
  };
  
  const connectWebSocket = async () => {
    const email = await AsyncStorage.getItem("email");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const client = (token) => {
      return new StompJs.Client({
      brokerURL: config.WebSocket_URL,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      logRawCommunication: true,
      connectHeaders: {
        accessToken: token,
      },
      reconnectDelay :0,
      debug: function(str) {
        console.log(str, '웹소켓 연결 로그'); // 웹소켓 연결 로그보려면 이거 주석 해제
      },
      onStompError: async function(str) {
        console.error('웹소켓 연결 에러 발생: ', str)
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await api.post(`${config.SERVER_URL}/token/re-issue`, {email: email, refreshToken: refreshToken});
        if (response.status === 200) {
          console.log('토큰 재발급 성공')
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          await AsyncStorage.setItem('accessToken', response.data.accessToken); 
          webSocketClient = client(response.data.accessToken);
          webSocketClient.activate();
        } else {
          console.error('토큰 재발급 실패')
        }
      }
    })}
    webSocketClient = client(accessToken);
    // 구독 채팅방에 들어가 있지 않을 때 채팅 메시지 받아보는 채널
    webSocketClient.onConnect = () => {
      subscription = webSocketClient.subscribe("/sub/new-message/" + email, (message) => {
        handleWebSocketMessage(message);
      },{ 'email': email });
    };

    webSocketClient.activate(); // 클라이언트 활성화
  };

  const publish = async (destination, header, email, nickName, id, message, type) => {
    if (webSocketClient) {
      webSocketClient.publish({
          destination: destination,
          Headers: header,
          body: JSON.stringify({
            message: message,
            senderEmail : email,
            senderNickName : nickName,
            roomId : id,
            type : type
          }),
        },
      );
    } else {
      console.error("WebSocket is not connected.");
    }
  };
  // 1. 채팅방에 들어와있는 유저 -> /sub/chat/chat.id
  // 2. 채팅방은 안들어와있는데 어플은 킨 유저 /sub/new-message/email -> notifee
  // 3. 어플이 백그라운드이거나 꺼진 유저 -> 푸시알림
  //
  // 둘다 끊는다면 다시 어플을 켰을 때 연결. 채팅방으로 들어왔으면 둘다 연결
  //
  // 서버에서 채팅방에 들어가있는지/어플을 켰는지 이걸 저장해놓고 있음.

  const subscribe = (destination, callback, headers) => {
    if (webSocketClient) {
      return webSocketClient.subscribe(destination, callback, headers);
    } else {
      console.error("웹소켓에 연결되지 않음");
    }
  };

  const login = async () => {
    await connectWebSocket();
  }

  const logout = async () => {
    webSocketClient.deactivate();
  }

  const isConnected = () => {
    return webSocketClient.connected;
  };

  const contextValue = {
    publish,login, logout, subscribe, isConnected
  };

  const handleWebSocketMessage = async (message) => {
    // 메시지 이벤트를 발생시키는 메서드  
    console.log(message.body, '온앱 푸시알림 이벤트 발생');
    const newMessage = JSON.parse(message.body);
    await pushNoti.displayNoti(newMessage.senderNickName, newMessage.message);
    EventEmitter.emit("newMessage", message);
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
