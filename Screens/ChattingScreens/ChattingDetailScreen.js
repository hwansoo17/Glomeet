import React,{useState, useLayoutEffect, useEffect} from "react";
import {View, Text, TouchableOpacity, TextInput, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pushNoti from '../../pushNoti'
import config from '../../config'
import { translateText,detectLanguage } from './Papago'; 
// 채팅방 아이디 받아와서 서버에 요청해서 채팅방 정보 받아오기
// 채팅방 정보 받아오면 채팅방 정보를 채팅방 화면에 띄우기
const email = 'aaaa'; 
const ChattingDetailScreen = ({route, navigation}) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const ws = new WebSocket(config.WebSocket_URL+email);
            console.log(ws);
            ws.onopen = () => {
                console.log('connected');
            };

            ws.onmessage = (e) => {
                const newMessage = JSON.parse(e.data);
                console.log(newMessage);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            };

            ws.onerror = (e) => {
                console.log(e.message);
            };

            ws.onclose = (e) => {
                console.log('websocket closed');
            };

            setSocket(ws);

        return () => {
            ws.close();
        }
    }, []);

    const {chat} = route.params;
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        console.log(message);
        if (socket && message.trim()) {
            const newMessage = {message: message, senderEmail: email, chatRoomId: chat.id };
            socket.send(JSON.stringify(newMessage));
            setMessage('');
        }
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            title: chat.id,
            headerTitleAlign: 'center',
        })
        console.log(chat);
    }, [navigation]);
    
    const renderItem = ({ item }) => {
        const isMyMessage = item.senderEmail === email;
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 1, backgroundColor: isMyMessage ? 'green' : 'gray' }}>
              <Text>{item.message}</Text>
              {item.translatedMessage && (
                <Text style={{ color: 'blue' }}>{item.translatedMessage}</Text>
              )}
            </View>
            <View style={{ flex: 1 }} />
          </View>
        );
      };
      
      const handleClickAPICall = async () => {
        try {
          setIsLoading(true);
      
          // 입력된 메시지 언어 감지
          const detectedLanguage = await detectLanguage(message);
          // 번역 API 호출
          const translatedMessage = await translateText(message, detectedLanguage, 'en');
          // 번역된 메시지를 화면에 표시하고 메시지 상태 초기화
          const newMessage = { message, senderEmail: email, chatRoomId: chat.id, translatedMessage };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessage('');
        } catch (error) {
          console.error('번역 중 오류 발생:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
    return (
        <View style={{flex:1, backgroundColor: 'white'}}>
            <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            inverted/>
            <TouchableOpacity onPress={handleClickAPICall}>
                <Text>번역하기</Text>
            </TouchableOpacity>
            <View style={{flex:1}}/>
            <View style={{flexDirection:'row', alignItems: 'center'}}>
                <View style={{borderWidth:1, borderRadius: 30 , flex:1}}>
                    <TextInput
                    value={message}
                    onChangeText={setMessage}/>
                </View>
                <View style={{flex:1}}/>
                <TouchableOpacity onPress={sendMessage}>
                    <Text>전송</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
    };

export default ChattingDetailScreen;