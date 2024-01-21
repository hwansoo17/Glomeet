import React, {useEffect, useState}from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";
const MatchingChatListScreen = ({navigation}) => {
  const [chatData, setChatdata] = useState([]);
  
  const getChatList = async () => {
    const email = await AsyncStorage.getItem('email');
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await fetch(config.SERVER_URL+'/chat/list', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+accessToken
      },
      body: JSON.stringify({email: email})
    });
    console.log(response.status);
    if (response.status == 200) {
      const chatData = await response.json();
      setChatdata(chatData);
      console.log(chatData);
    } else {
      const response = await fetch(config.SERVER_URL+'/token/re-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, refreshToken: refreshToken})
      });
      console.log(response.status);
      if (response.status == 200) {
        const data = await response.json();
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        getChatList();       
      } else {
        console.log('토큰 재발급 실패');
      };
    };
  };
  useEffect(() => {
    getChatList();
  },[]);
  const goChatroom = (chat) => {
    navigation.navigate('ChattingDetail', {chat});
  }
  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity 
      style={{flexDirection:'row'}}
      onPress={() => goChatroom(item)}>
        <View style={{flex:1}}>
          <Text>{item.name}</Text>
          <Text>{item.message}</Text>
          <View style={{flexDirection:'row'}}>
            {/*item.tags.map((tag, index) => (
              <Text key={index}>{tag}</Text>
            ))*/}
          </View>
        </View>
        <View>
          <Text>{item.time}</Text>
          <Text>{item.unread}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
      <View>
          <FlatList
              data={chatData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
          />
      </View>
  )
  };

export default MatchingChatListScreen;
