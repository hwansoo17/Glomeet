import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import EventEmitter from "react-native-eventemitter";


const MatchingChatListScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState([]);

  const formatDate = (sendAt) => {
    const messageDate = new Date(sendAt);
    const today = new Date();
    console.log(today)
    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();
    console.log(isToday)
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

  const getChatList = async () => {
    const email = await AsyncStorage.getItem("email");
    try {
      const response = await authApi.post("/matching/list", { email: email });
      if (response.status == 200) {
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
    console.log(message.body, '어떤형식으로옴?');
    const newMessage = JSON.parse(message.body);
    setChatData(currentChatData => {
      const updatedChatData = currentChatData.map(chatRoom => {
        if (chatRoom.id === newMessage.roomId) { 
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
    //console.log(chatData, '챗목록 데이터')
    EventEmitter.on("newMessage", messageListener);
    return () => {
      EventEmitter.removeListener("newMessage", messageListener);
    };
  }, []);

  const goChatroom = (chat) => {
    navigation.navigate("MatchingChatRoom", { chat });
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
          <Text>{formatDate(item.sendAt)}</Text>
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
