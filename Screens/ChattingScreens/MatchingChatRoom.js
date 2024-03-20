import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from "../../WebSocketProvider";
import { authApi } from "../../api";

const MatchingChatRoom = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activeUserCount, setActiveUserCount] = useState(0);
  const webSocketClient = useWebSocket();

  const chat = route.params.chat;

  useEffect(() => {
    const initialize = async () => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    };

    const messageListener = async (message) => {
      // 새로운 메시지가 도착하면 메시지 리스트를 업데이트
      const newMessage = JSON.parse(message.body);
      if (chat.id === newMessage.roomId) {
        if(newMessage.type == "ENTER" || newMessage.type == "EXIT"){
          setActiveUserCount(newMessage.readCount);
          return;
        }
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        await AsyncStorage.setItem( 'lastRead;'+chat.id , newMessage.sendAt.toString());
      }
    };

    const getMessageList = async () => {
      try {
        const lastReadAt = await AsyncStorage.getItem( 'lastRead;'+chat.id);
        const response = await authApi.post("/chat/message-list", { "roomId": chat.id, "lastReadAt" : lastReadAt});
        if (response.status == 200) {
          setMessages(response.data);
          const lastMessage = response.data.length > 0 ? response.data[response.data.length-1] : null;
          if(lastMessage != null){
            await AsyncStorage.setItem('lastRead;' + chat.id, lastMessage.sendAt.toString())
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    initialize().then(getMessageList)
      .then(() => {
        EventEmitter.on("newMessage", messageListener);
        webSocketClient.publish("/pub/chat/"+chat.id, "application/json", email, chat.id, "\u0000", "ENTER")
      });

    return () => {
      setMessages([]);
      webSocketClient.publish("/pub/chat/"+chat.id, "application/json", email, chat.id, "\u0000", "EXIT")
      EventEmitter.removeListener("newMessage", messageListener);
    };
  }, []);

  const sendMessage = () => {
    if (message === "") {
      return;
    }

    webSocketClient.publish("/pub/chat/"+chat.id, "application/json",  email, chat.id, message+"\u0000","SEND");
    setMessage("");
  };

  const renderItem = ({ item }) => {
    const isMyMessage = item.senderEmail === email;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View>
          <Text>
            {item.readCount}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1, backgroundColor: isMyMessage ? "green" : "gray" }}>
          <Text>{item.message}</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  messageContainer: {
    backgroundColor: "#E5E5E5",
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: "70%", // 최대 너비 설정
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#5782F1",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  myMessageText: {
    color: "#FFFFFF", 
  },
  otherMessageText: {
    color: "#000000", 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 30,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#5782F1",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MatchingChatRoom;
