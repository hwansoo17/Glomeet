import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";
import * as StompJs from "@stomp/stompjs";
import EventEmitter from "react-native-eventemitter";

const MatchingChatListScreen = ({ navigation }) => {
  const [chatData, setChatdata] = useState([]);
  let [client, changeClient] = useState(null);
  const TextEncodingPolyfill = require("text-encoding");
  Object.assign("global", {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
  });

  const handleWebSocketMessage = (message) => {
    // 메시지 이벤트를 발생시킴
    EventEmitter.emit("newMessage", message);
  };

  const getChatList = async () => {
    const email = await AsyncStorage.getItem("email");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const response = await fetch(config.SERVER_URL + "/chat/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
      },
      body: JSON.stringify({ email: email }),
    });
    if (response.status == 200) {
      const chatData = await response.json();
      setChatdata(chatData);
      return chatData;
    } else {
      return reIssueToken();
    }
  };

  const reIssueToken = async () => {
    const tokenResponse = await fetch(config.SERVER_URL + "/token/re-issue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, refreshToken: refreshToken }),
    });

    if (tokenResponse.status == 200) {
      const data = await response.json();
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      return getChatList();
    } else {
      console.log("토큰 재발급 실패");
      return [];
    }
    ;
  };

  const connectWebSocket = async (chatData) => {
    // 소켓 연결
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const clientdata = new StompJs.Client({
        brokerURL: "ws://localhost:8080/ws/chat",
        connectHeaders: {
          accessToken: accessToken,
        },
        debug: function(str) {
          // console.log(str);
        },
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // 구독 (내가 속해있는 채팅방 등록하는)
      clientdata.onConnect = () => {
        chatData.forEach((chat) => {
          clientdata.subscribe("/sub/chat/" + chat.id, (message) => {
            handleWebSocketMessage(message);
          });
        });
        changeClient(clientdata); // 클라이언트 갱신
      };

      clientdata.activate(); // 클라이언트 활성화
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedChatData = await getChatList();
      connectWebSocket(fetchedChatData);
    };
    fetchData();
  }, []);

  const goChatroom = (chat) => {
    navigation.navigate("ChattingDetail", { chat, client });
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => goChatroom(item)}>
        <View style={{ flex: 1 }}>
          <Text>{item.name}</Text>
          <Text>{item.partnerEmail}</Text>
          <View style={{ flexDirection: "row" }}>
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
  );
};

export default MatchingChatListScreen;
