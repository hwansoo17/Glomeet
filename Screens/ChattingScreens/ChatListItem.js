import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatDate } from "./formatDate";

const ChatListItem = ({ item, goChatRoom }) => {
  return(
    <TouchableOpacity 
      style= {{backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E4E5E6', height: 80, alignItems:'center', flexDirection: "row", padding: 10}}
      onPress={() => goChatRoom(item)}>
        <View style={{ backgroundColor: 'grey', width:48, height:48, borderRadius: 24, marginRight:10}}>
        </View>
        <View style={{flex:1}}>
          <Text style= {{fontFamily: "Pretendard-SemiBold", fontSize: 18}} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
          <Text style= {{fontFamily: "Pretendard-Light", fontSize: 14}} numberOfLines={2} ellipsizeMode="tail">{item.lastMessage}</Text>
        </View>
        <View>
          <View style={{flex:1}}/>
          <Text style={styles.sendAt}>{formatDate(item.sendAt)}</Text>
          <View style={{flex:2}}/>
          {item.unRead > 0 && (
            <View style={styles.unReadBadge}>
              <Text style={styles.unReadText}>{item.unRead}</Text>
            </View>
          )}
          <View style={{flex:1}}/>
        </View>  
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({


unReadBadge: {
  alignSelf: "flex-end",
  alignItems: "center",
  justifyContent:"center",
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: "red"

},
unReadText: {
  fontFamily: "Pretendard-SemiBold",
  fontSize: 12,
  alignSelf: "center",
  color: "white",
},
sendAt: {
  fontFamily: "Pretendard-Light",
  fontSize: 12,
}
});
export default ChatListItem;