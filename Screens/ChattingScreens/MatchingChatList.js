import React, { useEffect, useState } from "react";
import { View, FlatList, Modal, Text, TouchableOpacity } from "react-native";
import useChatList from '../../customHooks/useChatList';
import ChatListItem from "./ChatListItem";
import EventEmitter from "react-native-eventemitter";
import { authApi } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from '../../WebSocketProvider'

const MatchingChatList = ({ navigation }) => {
  const { chatData, getChatList } = useChatList("/matching/list");
  //챗리스트 가져오는 커스텀훅
  const { publish } = useWebSocket();
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedChatRoom, setSelectedChatRoom] = useState("")
  const handleMatchingSuccess = () => {
    getChatList() // 상태를 토글하여 컴포넌트를 재렌더링
    console.log("매칭완료 매칭채팅리스트 리스너")
  };
  const leaveChatRoom = async(chat) => {
    console.log(chat)
    try {
      const nickName = await AsyncStorage.getItem('nickName')
      const email = await AsyncStorage.getItem('email')
      const response = await authApi.delete(`/matching/leave/${chat.id}`)
      if (response.status === 200) {
        console.log(response.data, ': 매칭채팅방 나가기')
        getChatList()
        setModalVisible(false)
        publish("/pub/chat/"+ chat.id, "application/json", email, nickName, chat.id, `${nickName}님이 채팅방을 나갔습니다.`, "LEAVE")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=> {
    EventEmitter.on("matchingSuccess", handleMatchingSuccess)
    return () => {
      EventEmitter.removeListener("matchingSuccess", handleMatchingSuccess)
    }
  },[])
  const goChatRoom = (chat) => {
    navigation.navigate('MatchingChatRoom', { chat });
  };
  
  return (
    <View>
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View style={{flex:4}}/>
          <View style={{
            flex:1,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}><TouchableOpacity
              onPress={() => leaveChatRoom(selectedChatRoom)}
            >
              <Text style={{color:'#000'}}>채팅방 나가기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={chatData}
        renderItem={({item}) => <ChatListItem item = {item} goChatRoom = {goChatRoom} setModalVisible = {setModalVisible} setSelectedChatRoom = {setSelectedChatRoom}/>}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default MatchingChatList;
