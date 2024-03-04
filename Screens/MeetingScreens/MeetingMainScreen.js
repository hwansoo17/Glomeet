import React from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MeetingMainScreen = ({navigation}) => {
	const meetingData = [{id:'1', name: '테니스', description: '테니스를 같이 칠 사람을 모집합니다. 테니스는 정말 좋은 운동이에요. 저랑 함께 테니스를 쳐요. 테니스를 같이 칠 사람을 모집합니다. 테니스는 정말 좋은 운동이에요. 저랑 함께 테니스를 쳐요.', date: '3/3', place: '체육관', memberCount: '3', keyword:'운동'}, {id:'2', name: '축구', description: '같이 축구할 팀원들을 구해요!', date: '3/4', place: '운동장', memberCount: '11', keyword:'운동'}]
	const goMeetingRoom = (meeting) => {
    navigation.navigate("MeetingDetail", { meeting });
  };
	const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{}}
        onPress={() => goMeetingRoom(item)}>
				<Text>{item.name}</Text>
				<Text>{item.date}</Text>
				<Text>{item.place}</Text>
				<Text>{item.memberCount}</Text>
      </TouchableOpacity>
    </View>
  );
	return (
		<View>
			<Text>MeetingMainScreen</Text>
			<FlatList
        data={meetingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
		</View>
	)
};

export default MeetingMainScreen;
