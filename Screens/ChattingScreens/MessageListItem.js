import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { formatDate } from './formatDate';

const MessageListItem = ({ item, userEmail }) => {
  const screenWidth = Dimensions.get('window').width;
  const isMyMessage = item.senderEmail === userEmail;

  return (
    <View style={[styles.messageRow, { justifyContent: isMyMessage ? 'flex-end' : 'flex-start' }]}>
      {!isMyMessage && <View style={styles.avatar} />}
      {isMyMessage &&
        <View style={{alignSelf: 'flex-end', marginRight:5}}>
          <Text style={{alignSelf: 'flex-end'}}>{item.readCount}</Text>
          <Text style={{fontFamily:"Pretendard-Light", fontSize:12}}>{formatDate(item.sendAt)}</Text>
        </View>
        }
      <View style={styles.messageContent}>
        <Text style={styles.senderNickName}>{!isMyMessage && item.senderNickName}</Text>
        <View style={[
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          { maxWidth: isMyMessage ? screenWidth * 0.7 : screenWidth * 0.6 }
        ]}>
          <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
            {item.message}
          </Text>
        </View>
      </View>
      {!isMyMessage &&
      <View style={{alignSelf: 'flex-end', marginLeft:5}}>
        <Text style={{fontFamily:"Pretendard-Light"}}>{item.readCount}</Text>
        <Text style={{fontFamily:"Pretendard-Light", fontSize:12}}>{formatDate(item.sendAt)}</Text>
      </View>}
      
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    padding: 10,
  },
  myMessageBubble: {
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
  otherMessageContent: {
    flexDirection: "row",
  },
  otherMessageBubble: {
    paddingVertical: 8,
    paddingHorizontal:16,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
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
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
  }
});

export default MessageListItem;