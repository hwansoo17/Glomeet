import React, { useState,useEffect } from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api"
import {RefreshControl} from 'react-native';

const MeetingMain = ({navigation}) => {
	const [meetingData, setMeetingData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    console.log('handleRefreshStore');
    setIsRefreshing(true);
    getMeetingData()
    setIsRefreshing(false);
  };
  const getMeetingData = async () => {
    try {
      const response = await authApi.get('/meeting/all')
    if (response.status == 200) {
        setMeetingData(response.data)
        console.log(response.data, ': 미팅all');
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
				<Text style={{fontSize:20}}>{item.meeting.title}</Text>
				<Text>{item.meeting.meetingDate}</Text>
				<Text>{item.meeting.location}</Text>
				<Text>{item.participants}/{item.meeting.capacity}</Text>
      </TouchableOpacity>
    </View>
  );
	return (
		<View style={{flex:1}}>
			<Text>MeetingMainScreen</Text>
			<FlatList
        data={meetingData}
        renderItem={renderItem}
        keyExtractor={item => item.meeting.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('MeetingCreate')}>
        <Text>모임 등록하기</Text>
      </TouchableOpacity>
		</View>
	)
};

export default MeetingMain;
