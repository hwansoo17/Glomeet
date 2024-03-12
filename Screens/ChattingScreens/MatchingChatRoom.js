import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWebSocket } from "../../WebSocketProvider";
import { authApi } from "../../api";

const MatchingChatRoom = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const webSocketClient = useWebSocket();

  const chat = route.params.chat;

  useEffect(() => {
    const initialize = async () => {
      const email = await AsyncStorage.getItem("email");
      setEmail(email);
    };

    const messageListener = (message) => {
      const newMessage = JSON.parse(message.body);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const getMessageList = async () => {
      try {
        const response = await authApi.post("/chat/message-list", { "chatRoomId": chat.id });
        if (response.status === 200) {
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    initialize().then(getMessageList).then(() => webSocketClient.on("newMessage", messageListener));

    return () => {
      setMessages([]);
      webSocketClient.off("newMessage", messageListener);
    };
  }, []);

  const sendMessage = () => {
    if (message === "") {
      return;
    }

    webSocketClient.publish(`/pub/chat/${chat.id}`, "application/json", email, chat.id, message + "\u0000");

    setMessage("");
  };

  const renderItem = ({ item }) => {
    const isMyMessage = item.senderEmail === email;
    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
        <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>{item.message}</Text>
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
