import React, { useEffect, useState } from "react";
import {View, FlatList, Modal, Text, TouchableOpacity, Image } from "react-native";
import useChatList from '../../customHooks/useChatList';
import ChatListItem from "./ChatListItem";
import { authApi } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from '../../WebSocketProvider'
import { useTranslation } from "react-i18next";
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
        getChatList()
        setModalVisible(false)
        publish("/pub/chat/"+ chat.id, "application/json", email, nickName, chat.id, nickName, "LEAVE")
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(false);
        }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <TouchableOpacity 
            style={{flex:5}}
            onPress={() => setModalVisible2(false)}/>
          <View style={{flex:3, flexDirection: 'row'}}>
            <TouchableOpacity 
            style={{flex:1}}
            onPress={() => setModalVisible2(false)}
            />
            <View style={{flex:7, backgroundColor: "white",shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{ backgroundColor: 'grey', width:48, height:48, borderRadius: 24, marginRight:10}}>
                  <Image 
                    src={selectedChatRoom.imageAddress}
                    style={{width:48, height:48, borderRadius: 24}}/>
                </View>
                <View>
                  <Text style= {{fontFamily: "Pretendard-SemiBold", fontSize: 16, color: '#000'}} numberOfLines={1} ellipsizeMode="tail">{selectedChatRoom.title}</Text>
                </View>
              </View>
              <View style={{flex:1}}/>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079'}}>{t("ChatList.leaveChatRoom?")}</Text>
              <View style={{flex:1}}/>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{flex:2}}/>
                <TouchableOpacity 
                  onPress={() => setModalVisible2(false)}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 16, color: '#6B7079'}}>{t("ChatList.cancel")}</Text>
                </TouchableOpacity>
                <View style={{flex:1}}/>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible2(false)
                    leaveChatRoom(selectedChatRoom)
                  }}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 16, color: '#EC3232'}}>{t("ChatList.leave")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
            style={{flex:1}}
            onPress={() => setModalVisible2(false)}
            />
          </View>
          <TouchableOpacity 
            style={{flex:5}}
            onPress={() => setModalVisible2(false)}/>
        </View>
      </Modal>
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <TouchableOpacity style={{flex:3}}
            onPress={() => setModalVisible(false)}/>
          <View style={{
            borderTopRightRadius: 10,
            borderTopLeftRadius:10,
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
          }}>
            <View style={{flex:6, justifyContent: 'center', borderColor: '#e3e3e3', borderBottomWidth:0.7}}>
              <Text style={{fontFamily:'Pretendard-SemiBold', fontSize:16, color:'#000', paddingLeft:15}}>{selectedChatRoom.title}</Text>
            </View>
            <View style={{flex:0.5}}/>
            <TouchableOpacity
            style={{flex:5, justifyContent: 'center'}}
              onPress={() => {
                setModalVisible2(true)
                setModalVisible(false)
                }}
            >
              <Text style={{fontFamily:'Pretendard-Medium', fontSize:15, color:'#EC3232', paddingLeft:15}}>{t("ChatList.leaveChatRoom")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{flex:5, justifyContent: 'center'}}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{fontFamily:'Pretendard-Medium', fontSize:15, color:'#000', paddingLeft:15}}>{t("ChatList.cancel")}</Text>
            </TouchableOpacity>
            <View style={{flex:1}}/>
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

export default MeetingChatList;
