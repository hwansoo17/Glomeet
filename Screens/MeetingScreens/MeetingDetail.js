import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from '../../WebSocketProvider'
import EventEmitter from "react-native-eventemitter";

const MeetingDetail = ({route, navigation}) => {
  const meeting = route.params.meeting;
  const {subscribe, publish} = useWebSocket();

  const meetingJoin = async() => {
    console.log(meeting.id);
    const email = await AsyncStorage.getItem('email')
    try {
      const response = await authApi.post('/meeting/join', { meetingId : meeting.id});
      if (response.status == 200) {
        subscribe("/sub/chat/"+meeting.id, (message) => {
          handleWebSocketMessage(message)
        })
        publish("/pub/chat/"+ meeting.id, "application/json", email, meeting.id, "입장메세지인데 서버에서 할거임", "JOIN")
        navigation.reset({
          index: 0,
          routes: [{ name: 'MeetingMain' }]
        });
      };
    } catch (error) {
      if (error.response.status == 409) {
        console.log(error.response.data.message);
      } else {
        console.log(error);
      }
    };
  };

  const handleWebSocketMessage = (message) => {
    // 메시지 이벤트를 발생시키는 메서드
    EventEmitter.emit("newMessage", message);
  };

  return (
    <View>
      <Text>{meeting.title}</Text>
      <Text>{meeting.comment}</Text>
      <View style={{flexDirection:'row'}}>
        <Text>{meeting.meetingDate}</Text>
        <View style={{flex:1}}/>
        <Text>{meeting.capacity}</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text>{meeting.category}</Text>
        <View style={{flex:1}}/>
        <Text>{meeting.location}</Text>
      </View>
      <TouchableOpacity
        onPress={meetingJoin}>
          <Text>모임 참여하기</Text>
      </TouchableOpacity>
    </View>
  )
};

export default MeetingDetail;
