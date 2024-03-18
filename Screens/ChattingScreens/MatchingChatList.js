import React, { useEffect, useState, useCallback} from "react";
import { View, Text, TouchableOpacity, FlatList, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import EventEmitter from "react-native-eventemitter";
import { formatDate, getChatRoomsLastLeftAtMap} from "../../chatUtils";
import { useFocusEffect } from "@react-navigation/native";
const MatchingChatListScreen = ({ navigation }) => {
  const [chatData, setChatData] = useState([]);

  const getChatList = async () => {  
    try {
      const lastReadTime = await getChatRoomsLastLeftAtMap()
      const response = await authApi.post("/matching/list", {lastLeftMap : lastReadTime});
      if (response.status == 200) {
        console.log(lastReadTime, 'dddd111')
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
          return {
            ...chatRoom,
            message: newMessage.message,
            sendAt: new Date().toISOString(),
            unRead: (chatRoom.unRead || 0) + 1
          };
        } else {
          return chatRoom;
        }
      });
      return updatedChatData.sort((a, b) => new Date(b.sendAt) - new Date(a.sendAt));
    });
  };
  // useEffect(() => {
  //   getChatList();
  //   //console.log(chatData, '챗목록 데이터')
  //   EventEmitter.on("newMessage", messageListener);
  //   return () => {
  //     EventEmitter.removeListener("newMessage", messageListener);
  //   };
  // }, []);
  useFocusEffect(
    useCallback(() => {
      getChatList();
      //console.log(chatData, '챗목록 데이터')
      EventEmitter.on("newMessage", messageListener);
      return () => {
        EventEmitter.removeListener("newMessage", messageListener);
      };
    }, []),
  )
  const goChatroom = (chat) => {
    navigation.navigate("MatchingChatRoom", { chat });
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
          <Text>{formatDate(item.sendAt)}</Text>
          <Text>{item.unRead}</Text>
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
