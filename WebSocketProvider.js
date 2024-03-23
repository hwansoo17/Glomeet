import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StompJs from "@stomp/stompjs";
import config from "./config";
import EventEmitter from "react-native-eventemitter";
import {authApi} from "./api";
import pushNoti from "./pushNoti";


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

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    connectWebSocket()

    AppState.addEventListener('change', fn_handleAppStateChange);
    return () => {
      // 사용자가 앱의 상태가 변경 되었을 경우 실행이 된다.
      AppState.removeEventListener('change', fn_handleAppStateChange);
  };

  }, []); //연결하는 부분

  const fn_handleAppStateChange = async(nextAppState) => {
    const email = await AsyncStorage.getItem("email")
    console.log("appState.current ::: ", appState.current, nextAppState);

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('⚽️⚽️App has come to the foreground!');
      console.log(appState.current, nextAppState, '백에서 프론트');
      subscription = webSocketClient.subscribe("/sub/new-message/" + email, (message) => {
        handleWebSocketMessage(message);
      });
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
      console.log('⚽️⚽️App has come to the background!');
      subscription.unsubscribe();
    }
    appState.current = nextAppState;
};

  const connectWebSocket = async () => {
    const email = await AsyncStorage.getItem("email");
    // 소켓 연결
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      webSocketClient = new StompJs.Client({
        brokerURL: config.WebSocket_URL,
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
        logRawCommunication: true,
        connectHeaders: {
          accessToken: accessToken,
        },
        reconnectDelay : 0,
        debug: function(str) {
          console.log(str, '웹소켓 연결 로그'); // 웹소켓 연결 로그보려면 이거 주석 해제
        },
      });

      // 구독 채팅방에 들어가 있지 않을 때 채팅 메시지 받아보는 채널
      webSocketClient.onConnect = () => {
        subscription = webSocketClient.subscribe("/sub/new-message/" + email, (message) => {
          handleWebSocketMessage(message);
        });
      };

      webSocketClient.activate(); // 클라이언트 활성화
    } catch (err) {
      console.error(err, '너니?');
    }
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

  const subscribe = (destination, callback) => {
    if (webSocketClient) {
      return webSocketClient.subscribe(destination, callback);
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

  const contextValue = {
    publish,login, logout, subscribe
  };

  const handleWebSocketMessage = async (message) => {
    // 메시지 이벤트를 발생시키는 메서드
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
