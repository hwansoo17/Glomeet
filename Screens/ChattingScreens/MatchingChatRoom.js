import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal, Image, Alert, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import { useWebSocket } from "../../WebSocketProvider";
import useChatRoom from "../../customHooks/useChatRoom";
import MessageListItem from "./MessageListItem";
import SendIcon from "../../assets/SendIcon.svg";
import { authApi } from "../../api";
import { useTranslation } from "react-i18next";
const MatchingChatRoom = ({ route, navigation }) => {
  const { t } = useTranslation();
  const id =  route.params.chat.id;
  const chat = route.params.chat;
  const unRead = route.params.chat.unRead;
  const roomStatus = route.params.chat.roomStatus;

  const messages = useChatRoom(id);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [selectedChatUser, setSelectedChatUser] = useState([])
  const [reportComment, setReportComment] = useState('')
  const [reportEnabled, setReportEnabled] = useState(false)
  const [isRoomActive, setIsRoomActive] = useState(true)
  const webSocketClient = useWebSocket();

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
      const response = await authApi.post('/report/user', { roomId: selectedChatUser.roomId, targetNickName: selectedChatUser.senderNickName, comment: reportComment})
      if (response.status == 200) {
        setReportComment('')
        Alert.alert(t("ChatRoom.report"))
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(false);
          setReportComment('')
        }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <TouchableOpacity 
            style={{flex:2}}
            onPress={() => setModalVisible2(false)}/>
          <View style={{flex:3, flexDirection: 'row'}}>
            <TouchableOpacity 
            style={{flex:1}}
            onPress={() => setModalVisible2(false)}
            />
            <View style={{flex:7, backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20, alignItems:'center'}}>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079'}}>{t("ChatRoom.reasonReporting")}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex:1}}/>
                <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#D3D3D3'}}>{reportComment.length}/255</Text>
              </View>
              <View style={{ width:"100%", flex:4,borderRadius:10, backgroundColor: "#EEF3FF", padding:5, margin:10}}>
                <TextInput
                  value={reportComment}
                  multiline
                  onChangeText={setReportComment}
                  maxLength={255}/>
              </View>
              <View style={{ flexDirection:'row', alignItems:'center'}}>
                <View style={{flex:1}}/>
                <TouchableOpacity
                  onPress={() => {setModalVisible2(false); reportUser(); }}
                  disabled={!reportEnabled}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: reportEnabled ? '#EC3232' : '#D3D3D3'}}>{t("ChatRoom.toReport")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
            style={{flex:1}}
            onPress={() => setModalVisible2(false)}
            />
          </View>
          <TouchableOpacity 
            style={{flex:2}}
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
          <TouchableOpacity 
            style={{flex:2}}
            onPress={() => setModalVisible(false)}/>
          <View style={{flex:3, flexDirection: 'row'}}>
            <TouchableOpacity 
            style={{flex:1}}
            onPress={() => setModalVisible(false)}
            />
            <View style={{flex:7, backgroundColor: "white",shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20, alignItems:'center'}}>
              <View style={{flex:0.8}}/>
              <View style={{ width:160, height:160, borderRadius: 20, overflow: 'hidden', backgroundColor: 'grey'}}>
                <Image src={selectedChatUser.imageAddress} style={{ width:160, height:160}}/>
              </View>
              <View style={{flex:1}}/>
              <Text style={{fontFamily:"GmarketSansTTFBold", fontSize: 28, color: '#000'}}>{selectedChatUser.senderNickName}</Text>
              <View style={{flex:1}}/>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{flex:1}}/>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false)
                    setModalVisible2(true)
                  }}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: '#EC3232'}}>{t("ChatRoom.toReport")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
            style={{flex:1}}
            onPress={() => setModalVisible(false)}
            />
          </View>
          <TouchableOpacity 
            style={{flex:2}}
            onPress={() => setModalVisible(false)}/>
        </View>
      </Modal>
      <FlatList
        data={messages}
        renderItem={({item}) => <MessageListItem t={t} item={item} userEmail={email} setModalVisible = {setModalVisible} setSelectedChatUser = {setSelectedChatUser}/>}
        keyExtractor={(item, index) => index.toString()}
        inverted 
        onEndReached={loadMoreMessage}
        onEndReachedThreshold={0.7}/>
      <View style={{ flex: 1 }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // 키보드 오프셋을 적절하게 설정합니다. 
      >
        <View style={{ flexDirection: "row", alignItems: "center"}}>
          <View style={{ backgroundColor:'#F1F1F1', flex:5, height:50, justifyContent:'center', paddingHorizontal:5}}>
          {isRoomActive ? (
            <TextInput
              style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#000'}}
              placeholder={t("ChatRoom.enterMessage")}
              value={message}
              onChangeText={setMessage}
              placeholderTextColor={'#d3d3d3'}
              textAlignVertical='center'
            />
            ) : (
            <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#d3d3d3'}}>
              {t("ChatRoom.notConversation")}
            </Text>
            )
          }
          </View>
          <TouchableOpacity 
            style={{ backgroundColor:'#5782F1', flex:1, height:50, justifyContent:'center', alignItems: 'center'}}
            onPress={sendMessage}>
            <SendIcon/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MatchingChatRoom;
