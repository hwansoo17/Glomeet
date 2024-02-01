import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StompJs from "@stomp/stompjs";
import config from "./config";
import EventEmitter from "react-native-eventemitter";

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
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const response = await fetch(config.SERVER_URL + "/chat/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
      body: JSON.stringify({ email: email }),
    });
    if (response.status == 200) {
      const chatData = await response.json();
      return chatData;
    } else {
      return reIssueToken(email, refreshToken);
    }
  };

  const reIssueToken = async (email, refreshToken) => {
    const tokenResponse = await fetch(config.SERVER_URL + "/token/re-issue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, refreshToken: refreshToken }),
    });

    if (tokenResponse.status == 200) {
      const data = await tokenResponse.json();
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      return getChatList();
    } else {
      console.log("토큰 재발급 실패");
      return [];
    }
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
          destination: "/pub/chat/" + id,
          Headers: "application/json",
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
