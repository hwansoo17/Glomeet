import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import { useWebSocket } from "../../WebSocketProvider";
import useChatRoom from "../../useChatRoom";

const MatchingChatRoom = ({ route, navigation }) => {
  const id =  route.params.chat.id;
  const chat = route.params.chat;

  const messages = useChatRoom(id);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const webSocketClient = useWebSocket();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: chat.title,
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            EventEmitter.emit('leaveChatRoom', { chatRoomId: id });
            navigation.goBack();
          }}
        >
          <Text>뒤로</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, id]);

  useEffect(() => {
    const getEmail = async() => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    }
    getEmail()
  },[])

  const sendMessage = async () => {
    if (message === "") {
      return;
    }
    const email = await AsyncStorage.getItem("email");
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+id, "application/json",  email, nickName, id, message+"\u0000","SEND");
    setMessage("");
  };

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
