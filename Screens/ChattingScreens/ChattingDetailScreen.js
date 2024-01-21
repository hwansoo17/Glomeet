import React,{useState, useLayoutEffect, useEffect} from "react";
import {View, Text, TouchableOpacity, TextInput, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 채팅방 아이디 받아와서 서버에 요청해서 채팅방 정보 받아오기
// 채팅방 정보 받아오면 채팅방 정보를 채팅방 화면에 띄우기

const ChattingDetailScreen = ({route, navigation}) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [email, setEmail] = useState('');
    useEffect(() => {
        AsyncStorage.getItem('email').then(email => {
            setEmail(email);
            console.log(email);
            const ws = new WebSocket('ws://52.78.219.76:8080/chat?email='+email);
            ws.onopen = () => {
                console.log('connected');
            };

            ws.onmessage = (e) => {
                const newMessage = JSON.parse(e.data);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }

            ws.onerror = (e) => {
                console.log(e.message);
            }

            ws.onclose = (e) => {
                console.log('websocket closed');
            }

            setSocket(ws);
        })
        return () => {
            if (socket) {
            socket.close();
        }}
        
    }, []);
    console.log(socket);
    const {chat} = route.params;
    const [message, setMessage] = useState('');

    const sendMessage = () => {
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

    console.log(message);
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
