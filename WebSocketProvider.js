import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StompJs from "@stomp/stompjs";
import config from "./config";
import EventEmitter from "react-native-eventemitter";
import {authApi} from "./api";
import pushNoti from "./pushNoti";
const WebSocketContext = createContext();
// let [webSocketClient, setWebSocketClient] = useRef(null);
let webSocketClient = null;
// const client = useRef(null);
let subscriptions = {}; // 토픽과 subscription 매핑을 위한 객체
const TextEncodingPolyfill = require("text-encoding");
Object.assign("global", {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

export const WebSocketProvider = ({ children }) => {

  useEffect(() => {
    const connectWebSocketClient = async () => {
      const client = await connectWebSocket();
      return client
    };

    connectWebSocketClient()
  }, []); //연결하는 부분

  const connectWebSocket = async () => {
    const email = await AsyncStorage.getItem("email");
    // 소켓 연결
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const clientData = new StompJs.Client({
        brokerURL: config.WebSocket_URL,
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
        logRawCommunication: true,
        connectHeaders: {
          accessToken: accessToken,
        },
        reconnectDelay : 0,
        debug: function(str) {
          console.log(str); // 웹소켓 연결 로그보려면 이거 주석 해제
        },
      });

      // 구독 채팅방에 들어가 있지 않을 때 채팅 메시지 받아보는 채널
      clientData.onConnect = () => {
        clientData.subscribe("/sub/new-message/" + email, (message) => {
          handleWebSocketMessage(message);
        });

        webSocketClient = clientData;
      };

      clientData.activate(); // 클라이언트 활성화
      return clientData;
    } catch (err) {
      console.error(err, '너니?');
    }
  };

  const publish = async (destination, header, email, id, message, type) => {
    if (webSocketClient) {
      webSocketClient.publish({
          destination: destination,
          Headers: header,
          body: JSON.stringify({
            message: message,
            senderEmail : email,
            roomId : id,
            type : type
          }),
        },
      );
    } else {
      console.error("WebSocket is not connected.");
    }
  };

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
    await pushNoti.displayNoti(newMessage.senderEmail, newMessage.message);
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
