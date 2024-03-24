import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, LogBox, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import { useWebSocket } from "../../WebSocketProvider";
import {authApi} from "../../api";
// 채팅방 아이디 받아와서 서버에 요청해서 채팅방 정보 받아오기
// 채팅방 정보 받아오면 채팅방 정보를 채팅방 화면에 띄우기
const MeetingChatRoom = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activeUserCount, setActiveUserCount] = useState(0);
  const webSocketClient = useWebSocket();

  const id = route.params.id;
  let subscription = null;

  useEffect(() => {
    const initialize = async () => {
      const email = await AsyncStorage.getItem("email");
      subscription = webSocketClient.subscribe("/sub/chat/"+id, async (message) => {
        const newMessage = JSON.parse(message.body);
        if(newMessage.type === "SEND") {
          setMessages((prevMessages) => [newMessage,...prevMessages]);
          await AsyncStorage.setItem('lastRead;' + id, newMessage.sendAt.toString());
        }
      })
      setEmail(email);
    };

    // 필요없는 것 같은데 혹시 모르니 주석처리해놈
    // const messageListener = async (message) => {
    //   // console.log(message.body, '메시지리스너 인자')
    //   // 새로운 메시지가 도착하면 메시지 리스트를 업데이트
    //   const newMessage = JSON.parse(message.body);
    //   if (id === newMessage.roomId) {
    //     if(newMessage.type == "ENTER" || newMessage.type == "EXIT"){
    //       setActiveUserCount(newMessage.readCount);
    //       return;
    //     }
    //     setMessages((prevMessages) => [...prevMessages, newMessage]);
    //     await AsyncStorage.setItem( 'lastRead;'+id , newMessage.sendAt.toString());
    //   }
    // };

    const getMessageList = async () => {
      try {
        const response = await authApi.post("/chat/message-list", { "roomId": id });
        if (response.status == 200) {
          setMessages(response.data);
          console.log(response.data.length, '이게 뭔데');
          const lastMessage = response.data.length > 0 ? response.data[response.data.length-1] : null;
          if(lastMessage != null){
            await AsyncStorage.setItem('lastRead;' + id, lastMessage.sendAt.toString())
          }
        }
      } catch (error) {
        if (error.response.status == 401) {
        console.log(error, '메시지리스트');
        };
      };
    };

    initialize().then(getMessageList)
      .then();

    return async () => {
      setMessages([]);
      subscription.unsubscribe();
    };
  }, []);

  const sendMessage = async () => {
    if (message === "") {
      return;
    }
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+id, "application/json", email, nickName, id, message+"\u0000", 'SEND');
    setMessage("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const renderItem = ({ item }) => {
    const isMyMessage = item.senderEmail === email;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>
          {item.readCount}
        </Text>
        <View style={{ flex: 1 }}/>
        <View style={{ flex: 1, backgroundColor: isMyMessage ? "green" : "gray" }}>
          <Text>{item.message}</Text>
        </View>
        <View style={{ flex: 1 }}/>
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

export default MeetingChatRoom;
