import React from "react";
import { View, Text, TouchableOpacity, FlatList, LogBox } from "react-native";
import useChatList from '../../useChatList';
import { formatDate } from "../../formatDate";

const MeetingChatList = ({ navigation }) => {
  const chatData = useChatList("/meeting/list")
  //챗리스트 가져오는 커스텀훅

  const goChatRoom = (chat) => {
    navigation.navigate("MeetingChatRoom", {chat});
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => goChatRoom(item.id)}>
        <View style={{ flex: 1 }}>
          <Text>{item.title}</Text>
          <Text>{item.lastMessage}</Text>
          <View style={{ flexDirection: "row" }}>
            {/*item.tags.map((tag, index) => (
      <Text key={index}>{tag}</Text>
    ))*/}
          </View>
        </View>
        <View>
          <Text>{formatDate(item.sendAt)}</Text>
          <Text>{item.unRead}</Text>
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
  );
};

export default MeetingChatList;
