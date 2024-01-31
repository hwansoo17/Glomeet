import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, LogBox, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import config from "../../config";

// 채팅방 아이디 받아와서 서버에 요청해서 채팅방 정보 받아오기
// 채팅방 정보 받아오면 채팅방 정보를 채팅방 화면에 띄우기
const ChattingDetailScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");

  const chat = route.params.chat;
  const client = route.params.client;

  LogBox.ignoreLogs([
    " Non-serializable values were found in the navigation state",
  ]);

  useEffect(() => {

    const initialize = async () => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    };

    const messageListener = EventEmitter.addListener("newMessage", (message) => {
      // 새로운 메시지가 도착하면 메시지 리스트를 업데이트
      const newMessage = JSON.parse(message.body);
      console.log('메시지 리스너 작동');
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    const getMessageList = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await fetch(config.SERVER_URL + "/chat/message-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({ "chatRoomId": chat.id }),
      });
      const data = await response.json();
      setMessages(data);
    };

    initialize().then(getMessageList).then(messageListener);
    // initialize().then(r => messageListener());

    return () => {
      setMessages([]);
      messageListener.removeListener("newMessage")
    };
  }, []);

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message === "") {
      return;
    }

    client.publish({
      destination: "/pub/chat/" + chat.id,
      Headers: "application/json",
      body: JSON.stringify({
        senderEmail: email,
        chatRoomId: chat.id,
        message: message,
      }),
    });

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
            onChangeText={setMessage} />
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={sendMessage}>
          <Text>전송</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ChattingDetailScreen;
