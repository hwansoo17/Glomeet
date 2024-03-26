import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, LogBox, SafeAreaView, AppState } from "react-native";
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
  const webSocketClient = useWebSocket();

  const appState = useRef(AppState.currentState);
  const chat = route.params.chat;
  let subscription = null;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            EventEmitter.emit('leaveChatRoom', { chatRoomId: chat.id });
            navigation.goBack();
          }}
        >
          <Text>뒤로</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, chat.id]);
  useEffect(() => {
    console.log(subscription, '채팅방 구독 내역')
    const initialize = async () => {
      const email = await AsyncStorage.getItem("email");
      subscription = webSocketClient.subscribe("/sub/chat/"+chat.id, (message) => {
        const newMessage = JSON.parse(message.body);
        if(newMessage.type === "SEND") {
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
        }
      }, {'email' : email});
      setEmail(email);
    };

    const fn_handleAppStateChange = async(nextAppState) => {
      const email = await AsyncStorage.getItem("email")
      console.log("appState.current ::: ", appState.current, nextAppState);

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('⚽️⚽️App has come to the foreground!');
        console.log(appState.current, nextAppState, '백에서 프론트');
        initialize().then(getMessageList);
      }
      if (
        appState.current.match(/inactive|active/) &&
        nextAppState === 'background'
      ) {
        console.log('⚽️⚽️App has come to the background!');
        const email = await AsyncStorage.getItem("email");
        subscription.unsubscribe({"email" : email, "destination" : "/sub/chat/"+chat.id});
      }
      appState.current = nextAppState;
  };
    const getMessageList = async () => {
      try {
        const response = await authApi.post("/chat/message-list", { "roomId": chat.id});
        if (response.status == 200) {
          setMessages(response.data);
        }
      } catch (error) {
        if (error.response.status == 401) {
        console.log(error);
        };
      };
    };

    initialize().then(getMessageList);
    const appState1 = AppState.addEventListener('change', fn_handleAppStateChange);

    return async () => {
      appState1.remove()
      setMessages([]);
      const email = await AsyncStorage.getItem("email");
      subscription.unsubscribe({"email" : email, "destination" : "/sub/chat/"+chat.id});
    };
  }, []);

  const sendMessage = async () => {
    if (message === "") {
      return;
    }
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+chat.id, "application/json",  email, nickName, chat.id, message+"\u0000","SEND");
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
