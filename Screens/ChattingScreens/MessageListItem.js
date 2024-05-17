import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { formatDate } from './formatDate';
const MessageListItem = ({ item, userEmail, setModalVisible, setSelectedChatUser, t }) => {
  const ta = t
  const screenWidth = Dimensions.get('window').width;
  const isMyMessage = item.senderEmail === userEmail;
  const isSystemMessage = item.type === 'JOIN' || item.type === 'CREATE'|| item.type === 'LEAVE' || item.type === 'MATCHED';

    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.message}{ta(`ChatRoom.${item.type}`)}</Text>
        </View>
      );
    }
  return (
    <View style={[styles.messageRow, { justifyContent: isMyMessage ? 'flex-end' : 'flex-start' }]}>
      {!isMyMessage && 
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <TouchableOpacity 
          onPress={() => {
            setModalVisible(true)
            setSelectedChatUser(item)}}
          style={styles.avatar}
        >
          <Image src={item.imageAddress}
            style={{width:48, height:48, borderRadius: 24,}}/>
        </TouchableOpacity>
        <View>
        <View style={{width:'0%', height:26}}>
          <Text style={styles.senderNickName}>{item.senderNickName}</Text>
        </View>
          <View style={[styles.otherMessageBubble, {maxWidth: screenWidth * 0.6}]}>
            <Text style={styles.otherMessageText}>
              {item.message}
            </Text>
          </View>
        </View>
        <View style={{alignSelf: 'flex-end', marginLeft:5}}>
          {/* <Text style={{fontFamily:"Pretendard-Light", fontSize:12, color:'#a1a1a1'}}>{item.readCount}</Text> */}
          <Text style={{fontFamily:"Pretendard-Light", fontSize:12, color:'#a1a1a1'}}>{formatDate(item.sendAt)}</Text>
        </View>
      </View>
      }
      {isMyMessage &&
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <View style={{alignSelf: 'flex-end', marginRight:5}}>
          {/* <Text style={{alignSelf: 'flex-end', fontFamily:"Pretendard-Light", fontSize:12, color:'#a1a1a1'}}>{item.readCount}</Text> */}
          <Text style={{fontFamily:"Pretendard-Light", fontSize:12, color:'#a1a1a1'}}>{formatDate(item.sendAt)}</Text>
        </View>
        <View style={[styles.myMessageBubble,{ maxWidth: screenWidth * 0.7}]}>
          <Text style={styles.myMessageText}>
            {item.message}
          </Text>
        </View>
      </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    padding: 10,
    flex:1
  },
  myMessageBubble: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal:16,
    backgroundColor: "#5782F1",
    borderRadius: 20,
    
    // 기타 스타일
  },
  myMessageText: {
    fontFamily:"Pretendard_Light",
    fontSize: 16,
    color: "white",
    // 기타 스타일
  },
  otherMessageBubble: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal:16,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    flexWrap: 'wrap'
    // 기타 스타일
  },
  otherMessageText: {
    fontFamily:"Pretendard-Light",
    fontSize: 16,
    color: "black",
    // 기타 스타일
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "grey",
    marginRight: 10,
    // 기타 스타일
  },
  senderNickName: {
    color: "#000",
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
    position: 'absolute'
       
  },
  systemMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#6e6e6e',
    fontFamily: "Pretendard-Medium",
    // 시스템 메시지에 대한 추가 스타일링이 필요하면 여기에 작성합니다.
  },
});

export default MessageListItem;