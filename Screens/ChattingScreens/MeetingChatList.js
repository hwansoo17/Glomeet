import React, { useEffect, useState } from "react";
import {View, FlatList, Modal, Text, TouchableOpacity, Image } from "react-native";
import useChatList from '../../customHooks/useChatList';
import ChatListItem from "./ChatListItem";
import { authApi } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from '../../WebSocketProvider'
import { useTranslation } from "react-i18next";
import ChatRoomInfoModal from "../../customComponents/ChatRoomInfoModal";
import LeaveChatRoomModal from "../../customComponents/LeaveChatRoomModal";
const MeetingChatList = ({ navigation }) => {
  const { chatData, getChatList } = useChatList("/meeting/list")
  //챗리스트 가져오는 커스텀훅
  const { publish } = useWebSocket();
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [selectedChatRoom, setSelectedChatRoom] = useState([])
  const { t } = useTranslation();
  const goChatRoom = (chat) => {
    navigation.navigate("MeetingChatRoom", {chat})
  }
  const leaveChatRoom = async(chat) => {
    console.log(chat)
    try {
      const nickName = await AsyncStorage.getItem('nickName')
      const email = await AsyncStorage.getItem('email')
      const response = await authApi.delete(`/meeting/leave/${chat.id}`)
      if (response.status === 200) {
        console.log(': 매칭채팅방 나가기')
        navigation.reset({
          index: 0, 
          routes: [{
              name: 'Chatting', 
              state: {
                routes: [
                  { name: 'ChattingMain',
                    state: {routes: [{name: '모임'}]} }, 
                ],
              },
            },
          ],
        })
        setModalVisible(false)
        publish("/pub/chat/"+ chat.id, "application/json", email, nickName, chat.id, nickName, "LEAVE")
      }
    } catch (error) {
      console.log(error)
    }
  }
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

export default MeetingChatList;
