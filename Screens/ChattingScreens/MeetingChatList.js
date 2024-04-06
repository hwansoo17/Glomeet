import React from "react";
import { View, FlatList } from "react-native";
import useChatList from '../../customHooks/useChatList';
import ChatListItem from "./ChatListItem";

const MeetingChatList = ({ navigation }) => {
  const chatData = useChatList("/meeting/list")
  //챗리스트 가져오는 커스텀훅
  const goChatRoom = (chat) => {
    navigation.navigate("MeetingChatRoom", {chat})
  }

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

export default MeetingChatList;
