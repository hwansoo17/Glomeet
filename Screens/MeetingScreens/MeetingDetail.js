import React from "react";
import { useLayoutEffect } from "react";
import {View, Text, TouchableOpacity, ScrollView, Image, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from '../../WebSocketProvider'
import EventEmitter from "react-native-eventemitter";
import MainButton from "../../customComponents/MainButton";
import { formatDate } from "../ChattingScreens/formatDate";
import { useTranslation } from "react-i18next";
const MeetingDetail = ({route, navigation}) => {
  const detail = route.params.meeting;
  const {publish} = useWebSocket()
  const { t } = useTranslation();
  const meetingJoin = async() => {
    console.log(detail.id);
    const email = await AsyncStorage.getItem('email')
    const nickName = await AsyncStorage.getItem('nickName');
    try {
      const response = await authApi.post('/meeting/join', { meetingId : detail.id});
      if (response.status == 200) {
        publish("/pub/chat/"+ detail.id, "application/json", email, nickName, detail.id, nickName, "JOIN")
        goChatRoom(detail)
      };
    } catch (error) {
      if (error.response.status == 409) {
        const errorMessage = error.response.data.message;
        Alert.alert(t(`meeting.${errorMessage}`))
        console.log(errorMessage, '이미속해있음?');
      } else {
        console.log(error);
      }
    };
  };

  const goChatRoom = (chat) => {
    navigation.reset({
        index: 0,
        routes: [{
            name: 'Chatting',
            state: {
              routes: [
                { name: 'ChattingMain',
                  state: {routes: [{name: '모임'}]} },
                {
                  name: 'MeetingChatRoom',
                  params: { chat },
                },
              ],
            },
          },
        ],
      })
  };

  const handleWebSocketMessage = (message) => {
    // 메시지 이벤트를 발생시키는 메서드
    EventEmitter.emit("newMessage", message);
  };

  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
      <View style={{flex:7, backgroundColor:'grey'}}>
      <Image src={detail.meetingImageAddress} style={{flex:1}}/>
      </View>
      <View style={{flex:9, flexDirection: 'row'}}>
        <View style={{flex:1}}/>
        <View style={{flex:8}}>
          <View style={{flex:8, paddingVertical:20}}>
            <Text style={{fontFamily: 'Pretendard-Bold', fontSize: 24, color: '#09111F'}} numberOfLines={1}>{detail.title}</Text>
            <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#999999'}}>{formatDate(detail.createdAt)}</Text>
            {/* 모임 생성일자로 바꾸기 */}
            <ScrollView>
            <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 16, color: '#09111F'}}>{detail.comment}</Text>
            </ScrollView>
            <View style={{flex:3}}/>
            <View style={{borderBottomColor:'#E1E5EB', borderBottomWidth: 1, marginVertical:15}}/>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
              <View style={{width:48, height:48, borderRadius:24, backgroundColor: 'grey', overflow: 'hidden'}}>
                <Image src={detail.masterImageAddress} style={{flex:1}}/>
              </View>
              <View style={{marginLeft:10}}>
                <Text style={{fontFamily: 'Pretendard-Medium', fontSize: 14, color: '#09111F'}}>{detail.nickName}</Text>
                <View style={{margin:2}}/>
                <Text style={{fontFamily: 'Pretendard-Light', fontSize: 12, color: '#09111F'}}>{detail.participants}/{detail.capacity} {t("meeting.participating2")}</Text>
              </View>
              <View style={{flex:1}}/>
              <Text style={{backgroundColor: '#D1DCFB', paddingHorizontal:13, paddingVertical:5, borderRadius:10, fontSize:12, fontFamily: 'Pretendard-Regular', color: '#2D68FF'}}>{t(`category.${detail.category}`)}</Text>
            </View>
            <View style={{flex:1}}/>
          </View>
          <MainButton
            onPress={meetingJoin}
            title={t("meeting.JoinMeeting")}
          />
          <View style={{flex:1}}/>
        </View>
        <View style={{flex:1}}/>
      </View>    
    </View>
  )
};

export default MeetingDetail;
