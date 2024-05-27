import React, { useEffect, useState } from "react";
import { View, FlatList, Modal, Text, TouchableOpacity, Image } from "react-native";
import useChatList from '../../customHooks/useChatList';
import ChatListItem from "./ChatListItem";
import EventEmitter from "react-native-eventemitter";
import { authApi } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from '../../WebSocketProvider'
import { useTranslation } from "react-i18next";
import ChatRoomInfoModal from "../../customComponents/ChatRoomInfoModal";
import LeaveChatRoomModal from "../../customComponents/LeaveChatRoomModal";
const MatchingChatList = ({ navigation }) => {
  const { t } = useTranslation();
  const { chatData, getChatList } = useChatList("/matching/list");
  //챗리스트 가져오는 커스텀훅
  const { publish } = useWebSocket();
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [selectedChatRoom, setSelectedChatRoom] = useState([])
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
        publish("/pub/chat/"+ chat.id, "application/json", email, nickName, chat.id, nickName, "LEAVE")
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
      <LeaveChatRoomModal
        modalVisible={modalVisible2}
        setModalVisible={setModalVisible2}
        selectedChatRoom={selectedChatRoom}
        leaveChatRoom={leaveChatRoom}
        askLeaveChatRoom={t("ChatList.leaveChatRoom?")}
        cancel={t("ChatList.cancel")}
        leave={t("ChatList.leave")}
      />
      <ChatRoomInfoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        openLeaveChatRoomModal={setModalVisible2}
        selectedChatRoom={selectedChatRoom}
        leaveChatRoom={t("ChatList.leaveChatRoom")}
        cancel={t("ChatList.cancel")}
      />
      <FlatList
        data={chatData}
        renderItem={({item}) => <ChatListItem t={t} item = {item} goChatRoom = {goChatRoom} setModalVisible = {setModalVisible} setSelectedChatRoom = {setSelectedChatRoom}/>}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default MatchingChatList;
