import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import EventEmitter from "react-native-eventemitter";


const MeetingChatList = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState([]);


  const formatDate = (sendAt) => {
    const messageDate = new Date(sendAt);
    const today = new Date();
    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();
    if (isToday) {
      // 12시간 기준으로 오전/오후 포맷으로 변경
      let hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0시는 12로 표시
      const strTime = `${ampm} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      return strTime;
    } else {
      // 날짜만 표시
      return `${messageDate.getFullYear()}-${messageDate.getMonth() + 1}-${messageDate.getDate()}`;
    }
  };

  const getChatRoomsLastLeftAtMap = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const chatRoomKeys = allKeys.filter(key => key.startsWith('lastRead;'));

      const chatRoomsLastLeftAtMap = {};

      await Promise.all(chatRoomKeys.map(async key => {
        const roomId = key.substring('lastRead;'.length);
        const leftTime = await AsyncStorage.getItem(key);
        chatRoomsLastLeftAtMap[roomId] = leftTime;
      }));
      return chatRoomsLastLeftAtMap;
    } catch (error) {
      return {};
    }
  };

  const getChatList = async () => {

    try {
      const lastReadTime = await getChatRoomsLastLeftAtMap()

      const response = await authApi.post("/meeting/list" ,{lastLeftMap : lastReadTime});
      if (response.status == 200) {

        // console.log(response.data, ': 미팅리스트');
        setChatData(response.data);
      };
    } catch (error) {
      if (error.response.status == 401) {
        console.log(error)
      };
    };
  };
  const messageListener = async (message) => {
    // 새로운 메시지가 도착하면 메시지 리스트를 업데이트
    const newMessage = JSON.parse(message.body);
    setChatData(currentChatData => {
      const updatedChatData = currentChatData.map(chatRoom => {
        if (chatRoom.id === newMessage.roomId) {
          return {
            ...chatRoom,
            lastMessage: newMessage.message,
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
    getChatList();
    //console.log(chatData, '챗목록 데이터')
    EventEmitter.on("newMessage", messageListener);
    return () => {
      EventEmitter.removeListener("newMessage", messageListener);
    };
  }, []);

  const goChatroom = (id) => {
    navigation.navigate("MeetingChatRoom", {id});
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => goChatroom(item.id)}>
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

export default MeetingChatList;
