import React, { useState,useEffect, useLayoutEffect } from "react";
import {View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api"
import {RefreshControl} from 'react-native';
import { formatDate } from "../ChattingScreens/formatDate";

const MeetingMain = ({navigation}) => {
	const [meetingData, setMeetingData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredMeetingData, setFilteredMeetingData] = useState([]);
  const category = ['ALL', '운동', '여행', '게임', '문화', '음식', '언어']
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('MeetingCreate')}>
          <Text style={{paddingTop:2, fontSize:14, fontFamily: 'Pretendard-SemiBold', color: '#09111F'}}>모임 등록하기</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const filterMeetingData = (category) => {
    if (category === 'ALL') {
      setFilteredMeetingData(meetingData);
    } else {
      const filtered = meetingData.filter(
        (item) => item.category === category
      );
      setFilteredMeetingData(filtered);
    }
  };

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
  useEffect(() => {
    filterMeetingData(selectedCategory)
  },[meetingData,selectedCategory])

	const goMeetingRoom = (meeting) => {
    navigation.navigate("MeetingDetail", { meeting });
  };
	const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{flex:1}}
        onPress={() => goMeetingRoom(item)}>
        <View style={{flex:1, flexDirection: "row", alignItems: "center"}}>
          <View style={{width: 70, height: 70, backgroundColor:'grey', borderRadius: 10, margin:10, overflow: 'hidden'}}>
            <Image src={item.meetingImageAddress} style={{flex:1}}/>
          </View>
          <View style={{flex:1, height: 90, borderBottomWidth:1, borderColor: '#E1E5EB',justifyContent:'center', marginRight:10}}>
            <View style={{flexDirection: "row", alignItems: "center", maxWidth: '80%'}}>
              <Text style={{fontSize:16, fontFamily: 'Pretendard-Regular', marginRight:5, color: '#09111F'}} numberOfLines={1}>{item.title}</Text>
              <Text style={{fontSize:12, fontFamily: 'Pretendard-Regular', color: '#08C754', backgroundColor: '#D7F6E4', paddingHorizontal:5, borderRadius: 4}}>{item.category}</Text>
            </View>
            <Text style={{fontSize:14, fontFamily: 'Pretendard-Regular', color: '#6B7079'}} numberOfLines={1}>현재 {item.participants}명이 가입중인 모임</Text>
          </View>
        </View>
      </TouchableOpacity>
 
  );
	return (
		<View style={{flex:1, backgroundColor: 'white'}}>
      <Text style={{fontSize:18, fontFamily: 'Pretendard-Medium', marginRight:5, color: '#09111F', padding:10}}>카테고리</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, marginHorizontal:10,  borderBottomColor:'#E1E5EB', borderBottomWidth: 1}}>
        {category.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[{backgroundColor: '#D1DCFB', paddingHorizontal:13, paddingVertical:5, borderRadius:10}, selectedCategory == category && {backgroundColor: '#5782F1'}]}
          >
            <Text style={[{fontSize:12, fontFamily: 'Pretendard-Regular', color: '#6B7079'}, selectedCategory== category && { color: '#ffffff'}]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredMeetingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}
      />
		</View>
	)
};

export default MeetingMain;
