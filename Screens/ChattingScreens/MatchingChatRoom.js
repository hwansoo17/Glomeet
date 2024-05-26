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
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible4}
          onRequestClose={() => {
            setModalVisible4(false);
          }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <TouchableOpacity style={{flex:6}}
            onPress={() => setModalVisible4(false)}/>
          <View style={{flex:1, backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
            <View style={{flex:1}}/>
            <Text style={{fontFamily:'Pretendard-Medium', fontSize:18, color:'#000', textAlign:'center'}}>{t("ChatRoom.blockNoitce")}</Text>
            <View style={{flex:2}}/>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:4}}/>
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={() => {setModalVisible4(false);}}
              >
                <Text style={{fontFamily:'Pretendard-Medium', fontSize:16, color:'#6B7079', paddingLeft:15}}>{t("MeetingList.cancel")}</Text>
              </TouchableOpacity>
              <View style={{flex:1}}/>
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={() => {setModalVisible4(false); blockUser();}}
              >
                <Text style={{fontFamily:'Pretendard-Medium', fontSize:16, color:'#EC3232', paddingLeft:15}}>{t("MeetingList.toBlock")}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex:1}}/>
          </View>
        </View>
      </Modal>
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
            style={{flex:1}}
            onPress={() => setModalVisible2(false)}/>
          <View style={{minHeight:200, flexDirection: 'row'}}>
          {Platform.OS === 'ios' ? (
            <InputAccessoryView style={{ flexDirection: "row"}}>
              <View style={{flex:1,backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079', alignSelf:'center'}}>{t("ChatRoom.reasonReporting")}</Text>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 12, color: '#6B7079', alignSelf:'center', textAlign:'center'}}>{t("ChatRoom.reportingNotice")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex:1}}/>
                  <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#D3D3D3'}}>{reportComment.length}/255</Text>
                </View>
                <View style={{borderRadius:10, backgroundColor: "#EEF3FF", padding:5, margin:10}}>
                  <TextInput
                    value={reportComment}
                    multiline
                    onChangeText={setReportComment}
                    maxLength={255}/>
                </View>
                <View style={{flex:1}}/>
                <View style={{ flexDirection:"row"}}>
                  <View style={{flex:1}}/>
                  <TouchableOpacity
                    onPress={() => {setModalVisible2(false); reportUser()}}
                    disabled={!reportEnabled}
                  >
                    <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: reportEnabled ? '#EC3232' : '#D3D3D3'}}>{t("ChatRoom.toReport")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </InputAccessoryView>
          ) : (
            <View style={{flex:1,backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079', alignSelf:'center'}}>{t("ChatRoom.reasonReporting")}</Text>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 12, color: '#6B7079', alignSelf:'center', textAlign:'center'}}>{t("ChatRoom.reportingNotice")}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex:1}}/>
                <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#D3D3D3'}}>{reportComment.length}/255</Text>
              </View>
              <View style={{borderRadius:10, backgroundColor: "#EEF3FF", padding:5, margin:10}}>
                <TextInput
                  value={reportComment}
                  multiline
                  onChangeText={setReportComment}
                  maxLength={255}/>
              </View>
              <View style={{flex:1}}/>
              <View style={{ flexDirection:"row"}}>
                <View style={{flex:1}}/>
                <TouchableOpacity
                  onPress={() => {setModalVisible2(false); reportUser()}}
                  disabled={!reportEnabled}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: reportEnabled ? '#EC3232' : '#D3D3D3'}}>{t("ChatRoom.toReport")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) }
          </View>
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
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false)
                    setModalVisible4(true)
                  }}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: '#EC3232'}}>{t("MeetingList.toBlock")}</Text>
                </TouchableOpacity>
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
      <View style={{flex: Platform.OS === 'ios' ? 0 : 1}}>
      <FlatList
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
        data={messages}
        renderItem={({item}) => <MessageListItem t={t} item={item} userEmail={email} setModalVisible = {setModalVisible} setSelectedChatUser = {setSelectedChatUser}/>}
        keyExtractor={(item, index) => index.toString()}
        inverted
        onEndReached={loadMoreMessage}
        onEndReachedThreshold={0.7}/>
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
