import {useEffect, useState} from "react";
import { authApi } from "./api";
import EventEmitter from "react-native-eventemitter";

const useChatList = (apiEndpoint) => {
  const [chatData, setChatData] = useState([]);

  const getChatList = async () => {
    try {
      console.log("chatlist");
      const response = await authApi.post(apiEndpoint);
      if (response.status == 200) {
        setChatData(response.data);
        // console.log(response.data, ': 개인채팅방 리스트');
      };
    } catch (error) {
      if (error.response.status == 401) {
        console.log(error)
      };
    };
  };
  
  const messageListener = async (message) => {
    // 새로운 메시지가 도착하면 메시지 리스트를 업데이트
    // console.log(message.body, '어떤형식으로옴?');
    const newMessage = JSON.parse(message.body);
    setChatData(currentChatData => {
      const updatedChatData = currentChatData.map(chatRoom => {
        if (chatRoom.id === newMessage.roomId) {
          console.log(newMessage)
          return {
            ...chatRoom,
            lastMessage: newMessage.message,
            sendAt: new Date().toISOString(),
            unRead: (chatRoom.unRead || 0) + 1
          };
          // 타입이 exit 일때 unread값 0으로 바꿔준다.
        } else {
          return chatRoom;
        }
      });
      return updatedChatData.sort((a, b) => new Date(b.sendAt) - new Date(a.sendAt));
    });
  };

  const chatRoomExitListener = (id) => {
    console.log(id.chatRoomId, '채탱방 아이디');
    setChatData(currentChatData => {
      const updatedChatData = currentChatData.map(chatRoom => {
        if (chatRoom.id === id.chatRoomId) {
          return {
            ...chatRoom,
            unRead: 0
          };
          // 타입이 exit 일때 unread값 0으로 바꿔준다.
        } else {
          return chatRoom;
        }
      })
      return updatedChatData
    });
    
  }
  useEffect(() => {
    getChatList();
    //console.log(chatData, '챗목록 데이터')
    EventEmitter.on('leaveChatRoom', chatRoomExitListener)
    EventEmitter.on("newMessage", messageListener);
    return () => {
      EventEmitter.removeListener('leaveChatRoom', chatRoomExitListener)
      EventEmitter.removeListener("newMessage", messageListener);
    };
  }, []);
  

  return chatData;
}

export default useChatList; 