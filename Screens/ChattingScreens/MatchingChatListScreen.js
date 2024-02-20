import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from "../../WebSocketProvider";
import EventEmitter from "react-native-eventemitter";


const MatchingChatListScreen = ({ navigation }) => {
  const [chatData, setChatdata] = useState([]);
  let [client, changeClient] = useState(null);
  const webSocketClient = useWebSocket();

  const getChatList = async () => {
    const email = await AsyncStorage.getItem("email");
    try {
      const response = await authApi.post("/chat/list");
      if (response.status == 200) {
        setChatdata(response.data);
        console.log(response.data);
        return chatData;
      };
    } catch (error) {
      if (error.response.status == 401) {
        console.log(error)
      };
    };
  };

  useEffect(() => {
    getChatList();
    const chatUpdateListener = (newMessage) => {
      // 새 메시지가 도착했을 때 로직
      // 예를 들어, newMessage에는 새 메시지의 정보와 해당 채팅방 ID가 포함될 것입니다.
      setChatdata(currentChatData => {
        const updatedChatData = [...currentChatData];
        const chatIndex = updatedChatData.findIndex(chat => chat.id === newMessage.chatId);
        if (chatIndex > -1) {
          // 채팅방을 업데이트하고, 배열의 맨 앞으로 이동
          const updatedChat = {
            ...updatedChatData[chatIndex],
            message: newMessage.message, // 예시로 마지막 메시지를 업데이트
            unread: (updatedChatData[chatIndex].unread || 0) + 1 // 읽지 않은 메시지 수 업데이트
          };
          updatedChatData.splice(chatIndex, 1); // 기존 위치에서 제거
          updatedChatData.unshift(updatedChat); // 배열 맨 앞에 추가
        }
        return updatedChatData;
      });
    };

    EventEmitter.on("newChatMessage", chatUpdateListener);

    return () => {
      EventEmitter.removeListener("newChatMessage", chatUpdateListener);
    };
  }, []);

  const goChatroom = (chat) => {
    navigation.navigate("ChattingDetail", { chat, client });
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => goChatroom(item)}>
        <View style={{ flex: 1 }}>
          <Text>{item.partnerEmail}</Text>
          <Text>{item.message}</Text>
          <View style={{ flexDirection: "row" }}>
            {/*item.tags.map((tag, index) => (
      <Text key={index}>{tag}</Text>
    ))*/}
          </View>
        </View>
        <View>
          <Text>{item.time}</Text>
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

export default MatchingChatListScreen;
