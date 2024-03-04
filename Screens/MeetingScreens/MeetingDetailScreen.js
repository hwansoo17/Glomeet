import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MeetingDetailScreen = ({route, navigation}) => {
  const meeting = route.params.meeting;
  return (
    <View>
      <Text>{meeting.name}</Text>
      <Text>{meeting.description}</Text>
      <View style={{flexDirection:'row'}}>
        <Text>{meeting.date}</Text>
        <View style={{flex:1}}/>
        <Text>{meeting.memberCount}</Text>      
      </View>
      <View style={{flexDirection:'row'}}>
        <Text>{meeting.keyword}</Text>
        <View style={{flex:1}}/>
        <Text>{meeting.place}</Text>      
      </View>
      <TouchableOpacity>
          <Text>모임 참여하기</Text>
      </TouchableOpacity>
    </View>
  )
};

export default MeetingDetailScreen;
