import React from "react";
import { View, FlatList } from "react-native";
import useChatList from '../../useChatList';
import ChatListItem from "../../ChatListItem";

const MatchingChatList = ({ navigation }) => {
  const chatData = useChatList("/matching/list")
  //챗리스트 가져오는 커스텀훅

  const goChatRoom = (chat) => {
    navigation.navigate('MatchingChatRoom', { chat });
  };
  
  return (
    <View>
      <FlatList
        data={chatData}
        renderItem={({item}) => <ChatListItem item = {item} goChatRoom = {goChatRoom}/>}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default MatchingChatList;
