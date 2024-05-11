import {useEffect, useState, useRef} from "react";
import { authApi } from "../api";
import EventEmitter from "react-native-eventemitter";
import { AppState } from "react-native";

const useChatList = (apiEndpoint) => {
  const [chatData, setChatData] = useState([]);
  const appState = useRef(AppState.currentState);

  const sortChatData = (a, b) => {
    if ((a.unRead > 0) && (b.unRead === 0)) {
      return -1;
    } else if ((a.unRead === 0) && (b.unRead > 0)) {
      return 1;
    } else {
      return new Date(b.sendAt) - new Date(a.sendAt);
    }
  };

  const getChatList = async () => {
    try {
      console.log("chatlist");
      const response = await authApi.post(apiEndpoint);
      if (response.status == 200) {
        //console.log(apiEndpoint);
        setChatData(response.data.sort(sortChatData));
        //console.log(response.data, ': 채팅방 리스트');
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
          console.log(newMessage, 'useChatList')
          return {
            ...chatRoom,
            lastMessage: newMessage.message,
            sendAt: newMessage.sendAt,
            unRead: (chatRoom.unRead || 0) + 1
          };
        } else {
          return chatRoom;
        }
      });
      return updatedChatData.sort(sortChatData);
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
      return updatedChatData.sort(sortChatData);
    });
  }
  const chatRoomMessageListener = (message) => {
    const lastMessage = JSON.parse(message.body);
    setChatData(currentChatData => {
      const updatedChatData = currentChatData.map(chatRoom => {
        if (chatRoom.id === lastMessage.roomId) {
          return {
            ...chatRoom,
            lastMessage: lastMessage.message,
            sendAt: lastMessage.sendAt,
          };
        } else {
          return chatRoom;
        }
      })
      return updatedChatData.sort(sortChatData);
    });
  }

  const handleAppStateChange = async(nextAppState) => {
    console.log("appState.current ::: ", appState.current, nextAppState);

    if (
      appState.current.match(/background/) &&
      nextAppState === 'active'
    ) {
      // console.log('⚽️⚽️App has come to the foreground!');
      // console.log(appState.current, nextAppState, '백에서 프론트');
      getChatList();
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
      // console.log('⚽️⚽️App has come to the background!');
      
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    getChatList();
    //console.log(chatData, '챗목록 데이터')
    EventEmitter.on('leaveChatRoom', chatRoomExitListener);
    EventEmitter.on("newMessage", messageListener);
    EventEmitter.on("chatRoomMessage", chatRoomMessageListener);
    const appState1 = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      EventEmitter.removeListener('leaveChatRoom', chatRoomExitListener);
      EventEmitter.removeListener("newMessage", messageListener);
      EventEmitter.removeListener("chatRoomMessage", chatRoomMessageListener);
      appState1.remove()
    };
  }, []);
  

  return { chatData, getChatList };
}

export default useChatList; 