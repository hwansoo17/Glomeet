import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import { useWebSocket } from "../../WebSocketProvider";
import useChatRoom from "../../customHooks/useChatRoom";
import MessageListItem from "./MessageListItem";
import SendIcon from "../../assets/SendIcon.svg";
const MatchingChatRoom = ({ route, navigation }) => {
  const id =  route.params.chat.id;
  const chat = route.params.chat;

  const messages = useChatRoom(id);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const webSocketClient = useWebSocket();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id,
      headerTitleAlign: "center",
    });
  }, [navigation, id]);

  useEffect(() => {
    console.log(id, '아이디 확인')
    const getEmail = async() => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    }
    getEmail()
    chatRoomConnectMessage()
  },[])

  const chatRoomConnectMessage = async () => {
    const email = await AsyncStorage.getItem("email");
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+id, "application/json",  email, nickName, id, chat.unRead, "ENTER");
  };

  const sendMessage = async () => {
    if (message === "") {
      return;
    }
    const email = await AsyncStorage.getItem("email");
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+id, "application/json",  email, nickName, id, message+"\u0000","SEND");
    setMessage("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={messages}
        renderItem={({item}) => <MessageListItem item={item} userEmail={email}/>}
        keyExtractor={(item, index) => index.toString()}
        inverted />
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ backgroundColor:'#F1F1F1', flex:5, height:50}}>
          <TextInput
            style={{fontFamily: "Pretendard-Regular", fontSize: 14}}
            placeholder="메시지를 입력해주세요."
            value={message}
            onChangeText={setMessage}/>
        </View>
        <TouchableOpacity 
          style={{ backgroundColor:'#5782F1', flex:1, height:50, justifyContent:'center', alignItems: 'center'}}
          onPress={sendMessage}>
          <SendIcon/>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default MatchingChatRoom;
