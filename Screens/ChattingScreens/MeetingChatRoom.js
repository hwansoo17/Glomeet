import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from "../../WebSocketProvider";
import useChatRoom from "../../customHooks/useChatRoom";
import MessageListItem from "./MessageListItem";
import SendIcon from "../../assets/SendIcon.svg";
import EventEmitter from "react-native-eventemitter";
// 채팅방 아이디 받아와서 서버에 요청해서 채팅방 정보 받아오기
// 채팅방 정보 받아오면 채팅방 정보를 채팅방 화면에 띄우기
const MeetingChatRoom = ({ route, navigation }) => {
  const id =  route.params.chat.id;
  const unRead = route.params.chat.unRead;
  const title = route.params.chat.title;

  const messages = useChatRoom(id);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const webSocketClient = useWebSocket();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useEffect(() => {
    console.log(id, '아이디 확인')
    const getEmail = async() => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    }
    getEmail()
    chatRoomConnectMessage()
  }, []);

  const chatRoomConnectMessage = async () => {
    const email = await AsyncStorage.getItem("email");
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+id, "application/json",  email, nickName, id, unRead, "ENTER");
  };
  
  const sendMessage = async () => {
    if (message === "") {
      return;
    }
    const email = await AsyncStorage.getItem("email")
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+id, "application/json", email, nickName, id, message+"\u0000", 'SEND');
    setMessage("");
  };
  const loadMoreMessage= () => {
    console.log(messages[messages.length-1]?._id)
    const lastMessage = messages[messages.length - 1];
  if (lastMessage) {
    EventEmitter.emit('loadMoreMessage', {roomId: id, lastMessageId:  messages[messages.length-1]?._id})
  }

  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* <TouchableOpacity style={{flexDirection: "row", padding: 20, borderBottomWidth:1, borderBottomColor:"#E4E5E6"}}>
        <View style={styles.avatar}>
        </View>
        <View style={{flex:1}}/>
        <View>
          <Text>
            모임 카테고리
          </Text>
          <View style={{flex:1}}/>
          <Text>
            인원숫자
          </Text>
        </View>
      </TouchableOpacity> */}
      <FlatList
        data={messages}
        renderItem={({item}) => <MessageListItem item={item} userEmail={email}/>}
        keyExtractor={(item, index) => index.toString()}
        inverted 
        onEndReached={loadMoreMessage}
        onEndReachedThreshold={0.7}/>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: "row", alignItems: "center"}}>
        <View style={{ backgroundColor:'#F1F1F1', flex:5, height:50, justifyContent:'center', paddingHorizontal:5}}>
          <TextInput
            style={{fontFamily: "Pretendard-Regular", fontSize: 14}}
            placeholder="메시지를 입력해주세요."
            value={message}
            onChangeText={setMessage}
            textAlignVertical='center'/>
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

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    padding: 10,
  },
  myMessageBubble: {
    paddingVertical: 8,
    paddingHorizontal:16,
    backgroundColor: "#5782F1",
    borderRadius: 20,
    
    // 기타 스타일
  },
  myMessageText: {
    fontFamily:"Pretendard_Light",
    fontSize: 16,
    color: "white",
    // 기타 스타일
  },
  otherMessageContent: {
    // 스타일 정의
  },
  otherMessageBubble: {
    paddingVertical: 8,
    paddingHorizontal:16,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    // 기타 스타일
  },
  otherMessageText: {
    fontFamily:"Pretendard-Light",
    fontSize: 16,
    color: "black",
    // 기타 스타일
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "grey",
    marginRight: 10,
    // 기타 스타일
  },
  senderNickName: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
  }
});
export default MeetingChatRoom;
