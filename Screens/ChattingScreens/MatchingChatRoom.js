import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, LogBox, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import { useWebSocket } from "../../WebSocketProvider";
import {authApi} from "../../api";
// 채팅방 아이디 받아와서 서버에 요청해서 채팅방 정보 받아오기
// 채팅방 정보 받아오면 채팅방 정보를 채팅방 화면에 띄우기
const MatchingChatRoom = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activeUserCount, setActiveUserCount] = useState(0);
  const webSocketClient = useWebSocket();

  const chat = route.params.chat;

  useEffect(() => {
    const initialize = async () => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    };

    const messageListener = async (message) => {
      // 새로운 메시지가 도착하면 메시지 리스트를 업데이트
      const newMessage = JSON.parse(message.body);
      if (chat.id === newMessage.roomId) {
        if(newMessage.type == "ENTER" || newMessage.type == "EXIT"){
          setActiveUserCount(newMessage.readCount);
          return;
        }
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        await AsyncStorage.setItem( 'lastRead;'+chat.id , newMessage.sendAt.toString());
      }
    };

    const getMessageList = async () => {
      try {
        const lastReadAt = await AsyncStorage.getItem( 'lastRead;'+chat.id);
        const response = await authApi.post("/chat/message-list", { "roomId": chat.id, "lastReadAt" : lastReadAt});
        if (response.status == 200) {
          setMessages(response.data);
          const lastMessage = response.data.length > 0 ? response.data[response.data.length-1] : null;
          if(lastMessage != null){
            await AsyncStorage.setItem('lastRead;' + chat.id, lastMessage.sendAt.toString())
          }
        }
      } catch (error) {
        if (error.response.status == 401) {
        console.log(error);
        };
      };
    };

    initialize().then(getMessageList)
      .then(() => {
        EventEmitter.on("newMessage", messageListener);
        webSocketClient.publish("/pub/chat/"+chat.id, "application/json", email, chat.id, "\u0000", "ENTER")
      });

    return () => {
      setMessages([]);
      webSocketClient.publish("/pub/chat/"+chat.id, "application/json", email, chat.id, "\u0000", "EXIT")
      EventEmitter.removeListener("newMessage", messageListener);
    };
  }, []);

  const sendMessage = () => {
    if (message === "") {
      return;
    }

    webSocketClient.publish("/pub/chat/"+chat.id, "application/json",  email, chat.id, message+"\u0000","SEND");
    setMessage("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: chat.id,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const renderItem = ({ item }) => {
    const isMyMessage = item.senderEmail === email;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View>
          <Text>
            {item.readCount}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1, backgroundColor: isMyMessage ? "green" : "gray" }}>
          <Text>{item.message}</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        inverted />
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ borderWidth: 1, borderRadius: 30, flex: 1 }}>
          <TextInput
            value={message}
            onChangeText={setMessage}/>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={sendMessage}>
          <Text>전송</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default MatchingChatRoom;
