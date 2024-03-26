import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from '../../WebSocketProvider'
import EventEmitter from "react-native-eventemitter";

const MeetingDetail = ({route, navigation}) => {
  const detail = route.params.meeting;
  const {subscribe, publish} = useWebSocket();

  const meetingJoin = async() => {
    console.log(detail.meeting.id);
    const email = await AsyncStorage.getItem('email')
    try {
      const response = await authApi.post('/meeting/join', { meetingId : detail.meeting.id});
      if (response.status == 200) {
        subscribe("/sub/chat/"+detail.meeting.id, (message) => {
          handleWebSocketMessage(message)
        })
        publish("/pub/chat/"+ detail.meeting.id, "application/json", email, detail.meeting.id, "입장메세지인데 서버에서 할거임", "JOIN")
        goChatRoom(detail.meeting.id)
      };
    } catch (error) {
      if (error.response.status == 409) {
        console.log(error.response.data.message, '이미속해있음?');
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
    <View>
      <Text>{detail.meeting.title}</Text>
      <Text>{detail.meeting.comment}</Text>
      <View style={{flexDirection:'row'}}>
        <Text>{detail.meeting.meetingDate}</Text>
        <View style={{flex:1}}/>
        <Text>{detail.meeting.capacity}</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text>{detail.meeting.category}</Text>
        <View style={{flex:1}}/>
        <Text>{detail.meeting.location}</Text>
      </View>
      <TouchableOpacity
        onPress={meetingJoin}>
          <Text>모임 참여하기</Text>
      </TouchableOpacity>
    </View>
  )
};

export default MeetingDetail;
