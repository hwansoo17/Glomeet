import React from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MatchingChatListScreen = ({navigation}) => {
  const chats = [
    { id: 'A1', name: 'Toans', tags: ['#경영학과', '#남자', '#외향', '#축구'],  message: ['Hi, my name is Toans'], time: '12:33', unread: 1 },
    { id: 'A3', name: 'James', tags: ['#전자과', '#남자', '#내향', '#게임'],  message: 'Do you want to go to a cafe with me?', time: '09:07', unread: 9 },
    { id: 'A4', name: 'Nhung Hoàng', tags: ['#이비즈', '#남자', '#외향', '#노래'],  message: 'I took a walk with my dog today and...', time: '10/03', unread: 1 },
    { id: 'A2', name: 'Jessica', tags: ['#간호학과', '#여자', '#내향', '#독서'], message: 'Let’s go to a cafe together today', time: '12:05', unread: 0 },
    { id: 'A5', name: 'Kate', tags: ['#약학과', '#여자', '#외향', '#수영'], message: 'Do you know where the gym is?', time: '10/01', unread: 0 },
];
  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity style={{flexDirection:'row'}}>
        <View style={{flex:1}}>
          <Text>{item.name}</Text>
          <Text>{item.message}</Text>
          <View style={{flexDirection:'row'}}>
            {item.tags.map((tag) => (
              <Text>{tag}</Text>
            ))}
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
              data={chats}
              renderItem={renderItem}
              keyExtractor={item => item.id}
          />
      </View>
  )
  };

export default MatchingChatListScreen;
