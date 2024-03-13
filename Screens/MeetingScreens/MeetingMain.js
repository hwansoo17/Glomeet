import React, { useState,useEffect } from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api"
import config from "../../config";
config
const MeetingMain = ({navigation}) => {
	const [meetingData, setMeetingData] = useState([])
  const getMeetingData = async () => {
    try {
      const response = await authApi.get('/meeting/all')
    if (response.status == 200) {
        setMeetingData(response.data)
        console.log(response.data);
      };
    } catch (error) {
      console.log(error);
    };
  };
  useEffect(() => {
    getMeetingData()
  }, [])
  
	const goMeetingRoom = (meeting) => {
    navigation.navigate("MeetingDetail", { meeting });
  };
	const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{}}
        onPress={() => goMeetingRoom(item)}>
				<Text>{item.title}</Text>
				<Text>{item.meetingDate}</Text>
				<Text>{item.location}</Text>
				<Text>{item.participants}/{item.capacity}</Text>
      </TouchableOpacity>
    </View>
  );
	return (
		<View style={{flex:1}}>
			<Text>MeetingMainScreen</Text>
			<FlatList
        data={meetingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('MeetingCreate')}>
        <Text>모임 등록하기</Text>
      </TouchableOpacity>
		</View>
	)
};

export default MeetingMain;
