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
      if(newMessage.type === "JOIN") {
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
      if(newMessage.type === "ENTER") {// 새 타입 커넥트
        EventEmitter.emit("chatRoomConnect", message);
      }
    }, {'email' : email});
  };

  const handleAppStateChange = async(nextAppState) => {
    console.log("appState.current ::: ", appState.current, nextAppState);

    if (
      appState.current.match(/background/) &&
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
  const chatRoomConnectEventListener = async (message) => {
    const email = await AsyncStorage.getItem("email");
    const connectMessage = JSON.parse(message.body);
    if (email !== connectMessage.senderEmail) {
      console.log(email, connectMessage.senderEmail)
      console.log(connectMessage.senderEmail+ '채팅방 접속');
      const unReadCount = parseInt(connectMessage.message, 10);
      console.log(unReadCount, '언리드카운트')
      setMessages(prevMessages => {
        // 'SEND' 타입 메시지만 필터링
        const sendMessages = prevMessages.filter(msg => msg.type === 'SEND');
        // 가장 최근의 'SEND' 타입 메시지부터 unRead 개수만큼 선택
        const recentUnreadMessages = sendMessages.slice(0, unReadCount);
        console.log(recentUnreadMessages)

        // 선택된 메시지들의 readCount를 1 증가시키고, 나머지 메시지는 그대로 유지
        const updatedMessages = prevMessages.map(msg => {
          if (recentUnreadMessages.includes(msg)) {
            return { ...msg, readCount: msg.readCount + 1 };
          }
          return msg;
        });
        return updatedMessages;
      })
    }
  }
  
  useEffect(() => {
    console.log(subscription, '채팅방 구독 내역')
    initialize().then(getMessageList);
    const appState1 = AppState.addEventListener('change', handleAppStateChange);
    EventEmitter.on("chatRoomConnect", chatRoomConnectEventListener)

    return async () => {
      EventEmitter.emit('leaveChatRoom', { chatRoomId: id });
      EventEmitter.removeListener("chatRoomConnect", chatRoomConnectEventListener)
      appState1.remove()
      setMessages([]);
      const email = await AsyncStorage.getItem("email");
      subscription.unsubscribe({"email" : email, "destination" : "/sub/chat/"+id});
    };
  }, []);

  return messages
}
  export default useChatRoom;