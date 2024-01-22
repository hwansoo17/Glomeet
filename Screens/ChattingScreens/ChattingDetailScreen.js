import React,{useState, useLayoutEffect, useEffect, useRef} from "react";
import {View, Text, TouchableOpacity, TextInput, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pushNoti from '../../pushNoti'
import config from '../../config'
import { useActiveChatRoom } from '../../ActiveChatRoomContext';
// 채팅방 아이디 받아와서 서버에 요청해서 채팅방 정보 받아오기
// 채팅방 정보 받아오면 채팅방 정보를 채팅방 화면에 띄우기
const email = 'playground99@ajou.ac.kr'; 
const ChattingDetailScreen = ({route, navigation}) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const { setActiveChatRoomId } = useActiveChatRoom();
    const ws = useRef(null);
    useEffect(() => {
        if (!ws.current) {
        ws.current = new WebSocket(config.WebSocket_URL+email);
            console.log(ws);
            ws.current.onopen = () => {
                console.log('개인채팅방에 연결됐습니다.');
            };
        }
            ws.current.onmessage = (e) => {
                const newMessage = JSON.parse(e.data);
                console.log(newMessage);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            };

            ws.current.onerror = (e) => {
                console.log(e.message);
            };

            ws.current.onclose = (e) => {
                console.log('websocket closed');
            };

            setSocket(ws);

    }, []);

    const {chat} = route.params;
    
    const [message, setMessage] = useState('');
    useEffect(() => {
        // 채팅방에 들어갈 때 활성화된 채팅방 ID 설정
        setActiveChatRoomId(chat.id);
        return () => {
          // 채팅방에서 나갈 때 활성화된 채팅방 ID 해제
          setActiveChatRoomId(null);
        };
      }, [chat.id]);
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
    
    const renderItem = ({item}) => {
        const isMyMessage = item.senderEmail === email;
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex:1}}/>
                <View style={{flex:1, backgroundColor: isMyMessage ? 'green' : 'gray'}}>
                    <Text>{item.message}</Text>
                </View>
                <View style={{flex:1}}/>
            </View>
        )
    };

    
    return (
        <View style={{flex:1, backgroundColor: 'white'}}>
            <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            inverted/>
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
