import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { authApi } from "../api";
import EventEmitter from "react-native-eventemitter";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from "../WebSocketProvider";

const useChatRoom = (id) => {
  const [messages, setMessages] = useState([]);
  const webSocketClient = useWebSocket();
  const appState = useRef(AppState.currentState);
  let subscription = null;

  const initialize = async () => {
    const email = await AsyncStorage.getItem("email");
    subscription = webSocketClient.subscribe("/sub/chat/"+id, (message) => {
      const newMessage = JSON.parse(message.body);
      if(newMessage.type === "SEND") {
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
        EventEmitter.emit("chatRoomMessage", message);
      }
    }, {'email' : email});
  };

  const handleAppStateChange = async(nextAppState) => {
    console.log("appState.current ::: ", appState.current, nextAppState);

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // console.log('⚽️⚽️App has come to the foreground!');
      // console.log(appState.current, nextAppState, '백에서 프론트');
      initialize().then(getMessageList);
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
      // console.log('⚽️⚽️App has come to the background!');
      const email = await AsyncStorage.getItem("email");
      subscription.unsubscribe({"email" : email, "destination" : "/sub/chat/"+id});
    }
    appState.current = nextAppState;
  };

  const getMessageList = async () => {
    try {
      const response = await authApi.post("/chat/message-list", { "roomId": id});
      if (response.status == 200) {
        setMessages(response.data);
      }
    } catch (error) {
      if (error.response.status == 401) {
      console.log(error);
      };
    };
  };

  useEffect(() => {
    console.log(subscription, '채팅방 구독 내역')
    initialize().then(getMessageList);
    const appState1 = AppState.addEventListener('change', handleAppStateChange);

    return async () => {
      appState1.remove()
      setMessages([]);
      const email = await AsyncStorage.getItem("email");
      subscription.unsubscribe({"email" : email, "destination" : "/sub/chat/"+id});
    };
  }, []);

  return messages
}
  export default useChatRoom;