import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal, Image, Alert, InputAccessoryView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import { useWebSocket } from "../../WebSocketProvider";
import useChatRoom from "../../customHooks/useChatRoom";
import MessageListItem from "./MessageListItem";
import SendIcon from "../../assets/SendIcon.svg";
import { authApi } from "../../api";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileModal from "../../customComponents/ProfileModal"
import ReportModal from "../../customComponents/ReportModal";
import BlockModal from "../../customComponents/BlockModal";

const MatchingChatRoom = ({ route, navigation }) => {
  const { t } = useTranslation();
  const id =  route.params.chat.id;
  const chat = route.params.chat;
  const unRead = route.params.chat.unRead;
  const roomStatus = route.params.chat.roomStatus;


  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [modalVisible4, setModalVisible4] = useState(false)
  const [selectedChatUser, setSelectedChatUser] = useState([])
  const [reportComment, setReportComment] = useState('')
  const [reportEnabled, setReportEnabled] = useState(false)
  const [isRoomActive, setIsRoomActive] = useState(true)
  const [key, setKey] = useState(0);
  const webSocketClient = useWebSocket();
  const insets = useSafeAreaInsets();
  const messages = useChatRoom(id, key);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: chat.title,
      headerTitleAlign: "center",
    });
  }, [navigation, id]);

  useEffect(() => {
    if (roomStatus == 'INACTIVE') {
      Alert.alert(t("ChatRoom.noChatRoom"))
      setIsRoomActive(false)
    }
    if (roomStatus == 'ACTIVE') {
      checkChatRoomStatus(id)
    }
    console.log(id, '아이디 확인')
    const getEmail = async() => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    }
    getEmail()
    chatRoomConnectMessage()
  },[])

  useEffect(() => {
    if (reportComment != '') {
      setReportEnabled(true);
    } else {
      setReportEnabled(false);
    }
  }, [reportComment]);

  const checkChatRoomStatus = async (id) => {
    try {
      const response = await authApi.get("/chat/status", {params:{id: id}})
      if (response.status == 200) {
        if (response.data.roomStatus == "ACTIVE") {
          setIsRoomActive(true)
        } else {
          Alert.alert(t("ChatRoom.noChatRoom"))
          setIsRoomActive(false)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const chatRoomConnectMessage = async () => {
    const email = await AsyncStorage.getItem("email");
    const nickName = await AsyncStorage.getItem("nickName");
    webSocketClient.publish("/pub/chat/"+id, "application/json",  email, nickName, id, unRead, "ENTER");
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

  const loadMoreMessage= () => {
    console.log(messages[messages.length-1]?._id)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      EventEmitter.emit('loadMoreMessage', {roomId: id, lastMessageId:  messages[messages.length-1]?._id})
    }
  }
  const reportUser = async() => {
    try {
      const response = await authApi.post('/report/user', { roomId: selectedChatUser.roomId, targetNickname: selectedChatUser.senderNickName, description: reportComment})
      if (response.status == 200) {
        setReportComment('')
        Alert.alert(t("ChatRoom.report"))

      }
    } catch (e) {
      console.log(e)
    }
  }
  const blockUser = async() => {
    try {
      const response = await authApi.post('/user/block', { targetNickname: selectedChatUser.senderNickName})
      if (response.status == 200) {
        Alert.alert(t("MeetingList.blockComplete"))
        setKey(prevKey => prevKey + 1);
      }
    } catch (e) {
      if (e.response.status == 400) {
        Alert.alert(t(`MeetingList.${e.response.data.message}`))
      }
    }
  }

  return (
    <View style={{ flex: 1, paddingBottom : Platform.OS === 'ios' ? insets.bottom + 50 : 0, backgroundColor: "white" }}>
      <BlockModal
        modalVisible={modalVisible4}
        setModalVisible={setModalVisible4}
        blockNotice={t("ChatRoom.blockNoitce")}
        cancel={t("MeetingList.cancel")}
        toBlock={t("MeetingList.toBlock")}
        blockUser={blockUser}
      />
      <ReportModal
        modalVisible={modalVisible2} 
        setModalVisible={setModalVisible2}
        reportComment={reportComment}
        setReportComment={setReportComment}
        report={reportUser}
        reportEnabled={reportEnabled}
        reportReason={t("ChatRoom.reasonReporting")}
        reportNotice={t("ChatRoom.reportingNotice")}
        toReport={t("ChatRoom.toReport")}
      />
      <ProfileModal
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible}
        selectedChatUser={selectedChatUser} 
        openBlockModal={setModalVisible4} 
        openReportModal={setModalVisible2} 
        blockText = {t("MeetingList.toBlock")} 
        reportText = {t("ChatRoom.toReport")}
      />
      <View style={{flex: Platform.OS === 'ios' ? 0 : 1}}>
      <FlatList
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 80,
        }}
        data={messages}
        renderItem={({item}) => <MessageListItem t={t} item={item} userEmail={email} setModalVisible = {setModalVisible} setSelectedChatUser = {setSelectedChatUser}/>}
        keyExtractor={(item, index) => index.toString()}
        inverted
        onEndReached={loadMoreMessage}
        onEndReachedThreshold={0.7}
        />
      {Platform.OS === 'android' && <View style={{flex: 1}}/>}
      {Platform.OS === 'ios' ? (
        <InputAccessoryView style={{ flexDirection: "row"}}>
          <View style={{ backgroundColor:'#F1F1F1', flex:5, minHeight:50, justifyContent:'center', paddingHorizontal:5}}>
          {isRoomActive ? (<TextInput
              style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#000'}}
              placeholder={t("ChatRoom.enterMessage")}
              value={message}
              onChangeText={setMessage}
              multiline
              placeholderTextColor={'#d3d3d3'}
              textAlignVertical='center'/>): (<Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#d3d3d3'}}>{t("ChatRoom.notConversation")}</Text>)}

          </View>
          <TouchableOpacity
            style={{ backgroundColor:'#5782F1', flex:1, justifyContent:'center', alignItems: 'center'}}
            disabled={message == ""}
            onPress={sendMessage}>
            <SendIcon/>
          </TouchableOpacity>
        </InputAccessoryView>
        ) : (
        <View style={{ flexDirection: "row"}}>
          <View style={{ backgroundColor:'#F1F1F1', flex:5, minHeight:50, justifyContent:'center', paddingHorizontal:5}}>
          {isRoomActive ? (<TextInput
              style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#000'}}
              placeholder={t("ChatRoom.enterMessage")}
              value={message}
              onChangeText={setMessage}
              multiline
              placeholderTextColor={'#d3d3d3'}
              textAlignVertical='center'/>): (<Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#d3d3d3', textAlignVertical:'center'}}>{t("ChatRoom.notConversation")}</Text>)}

          </View>
          <TouchableOpacity
            style={{ backgroundColor:'#5782F1', flex:1, justifyContent:'center', alignItems: 'center'}}
            disabled={message == ""}
            onPress={sendMessage}>
            <SendIcon/>
          </TouchableOpacity>
        </View>
        )
      }
      </View>
    </View>
  );
};

export default MatchingChatRoom;
