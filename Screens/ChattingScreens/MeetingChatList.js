import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from "../../WebSocketProvider";
import EventEmitter from "react-native-eventemitter";


const MeetingChatList = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState([]);
  let [client, changeClient] = useState(null);

  const getChatList = async () => {
    try {
      const response = await authApi.post("/meeting/chat");
      if (response.status == 200) {
        setChatData(response.data);
        console.log(response.data);
        return chatData;
      };
    } catch (error) {
      if (error.response.status == 401) {
        console.log(error.response.message, '미팅챗리스트')
      };
    };
  };
  const messageListener = async (message) => {
    // 새로운 메시지가 도착하면 메시지 리스트를 업데이트
    console.log(message.body, '어떤형식으로옴?');
    const newMessage = JSON.parse(message.body);
    setChatData(currentChatData => {
      const updatedChatData = currentChatData.map(chatRoom => {
        if (chatRoom.id === newMessage.chatRoomId) { 
          return {
            ...chatRoom, 
            message: newMessage.message, 
            sendAt: new Date().toISOString()
          };
        } else {
          return chatRoom;
        }
      });
      return updatedChatData.sort((a, b) => new Date(b.sendAt) - new Date(a.sendAt));
    });
  };
  
  useEffect(() => {
    console.log(chatData, '챗리스트데이터 바뀔때마다 업데이트확인')
  },[chatData])
  useEffect(() => {
    getChatList();
    console.log(chatData, '챗목록 데이터')
    EventEmitter.on("newMessage", messageListener);
    return () => {
      EventEmitter.removeListener("newMessage", messageListener);
    };
  }, []);

  const goChatroom = (chat) => {
    navigation.navigate("MatchingChatRoom", { chat, client });
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => goChatroom(item)}>
        <View style={{ flex: 1 }}>
          <Text>{item.title}</Text>
          <Text>{item.lastMessage}</Text>
          <View style={{ flexDirection: "row" }}>
            {/*item.tags.map((tag, index) => (
      <Text key={index}>{tag}</Text>
    ))*/}
          </View>
        </View>
        <View>
          <Text>{item.sendAt}</Text>
          <Text>{item.unread}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default MeetingChatList;