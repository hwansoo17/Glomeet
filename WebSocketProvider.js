import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StompJs from "@stomp/stompjs";
import config from "./config";
import EventEmitter from "react-native-eventemitter";
import {authApi} from "./api";
const WebSocketContext = createContext();
// let [webSocketClient, setWebSocketClient] = useRef(null);
let webSocketClient = null;

const TextEncodingPolyfill = require("text-encoding");
Object.assign("global", {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

export const WebSocketProvider = ({ children }) => {

  useEffect(() => {
    const connectWebSocketClient = async () => {
      const chatList = await getChatList();
      const client = await connectWebSocket(chatList);
      return client;
    };

    connectWebSocketClient().then(client => {
      webSocketClient = client;
    });
  }, []);

  const getChatList = async () => {
    const email = await AsyncStorage.getItem("email");
    try {
      const response = await authApi.post("/chat/list", { email: email });
      if (response.status == 200) {
        return response.data;
      };
    } catch (error) {
      if (error.response.status == 401) {
        console.log(error)
      };
    };
  };
    

  const connectWebSocket = async (chatData) => {
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
          // console.log(str); // 웹소켓 연결 로그보려면 이거 주석 해제
        },
      });

      // 구독 (내가 속해있는 채팅방 등록하는)
      clientData.onConnect = () => {
        chatData.forEach((chat) => {
          clientData.subscribe("/sub/chat/" + chat.id, (message) => {
            handleWebSocketMessage(message);
          });
        });
        webSocketClient = clientData;
      };

      clientData.activate(); // 클라이언트 활성화
      return clientData;
    } catch (err) {
      console.error(err);
    }
  };

  const publish = async (destination, header, email, id, message) => {
    if (webSocketClient) {
      webSocketClient.publish({
          destination: destination,
          Headers: header,
          body: JSON.stringify({
            senderEmail: email,
            chatRoomId: id,
            message: message,
          }),
        },
      );
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const login = async () => {
    const data = await getChatList();
    await connectWebSocket(data);
  }

  const logout = async () => {
    webSocketClient.deactivate();
  }

  const contextValue = {
    publish,login, logout
  };

  const handleWebSocketMessage = (message) => {
    // 메시지 이벤트를 발생시키는 메서드
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