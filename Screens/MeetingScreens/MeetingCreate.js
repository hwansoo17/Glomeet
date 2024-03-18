import React, { useState } from "react";
import {View, Text, TouchableOpacity, TextInput, FlatList, Alert, Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from '../../WebSocketProvider'
import EventEmitter from "react-native-eventemitter";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const MeetingCreate = ({navigation}) => {
  const [url, setUrl] = useState('ㅋㅋㅋ')
  const [imageUri, setImageUri] = useState(null); // 상태 추가
  const [capacity, setCapacity] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('2024-11-11')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const keyword = ['운동', '여행', '게임', '문화', '음식', '언어']
  const {subscribe, publish} = useWebSocket();

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImageUri(source.uri); // 선택된 이미지의 URI를 상태에 저장
        setUrl(source.uri); // URL 상태도 업데이트(선택 사항)
      }
    });
  };

  const createMeeting = async() => {
    // console.log(url, capacity, title, description, location, category)
    try{
      const email = await AsyncStorage.getItem('email')
      const response = await authApi.post('/meeting/create', { url: url, title: title, comment: description, capacity: capacity, location: location, meetingDate: date, category: category})
    if (response.status == 200) {
      console.log(response.data)
      console.log('@@@@')
      subscribe("/sub/chat/"+response.data.id, (message) => {
        handleWebSocketMessage(message)
      })
      
      goChatRoom(response.data.id)
      Alert.alert('모임이 생성되었습니다')
      await publish("/pub/chat/"+ response.data.id, "application/json", email, response.data.id,"생성메세지인데 서버에서 할거임", "CREATE")
    }
    } catch (error) {
      console.log(error)
      if (error.response.status == 401) {
        console.log(error, '왜 오류?')
      };
      if (error.response.status == 400) {
       console.log(error, '무슨 오류')
      }
    };
  };
  const goChatRoom = (id) => {
    navigation.reset({
        index: 0, 
        routes: [{
            name: 'Chatting', 
            state: {
              routes: [
                { name: 'ChattingMain',
                  state: {routes: [{name: '모임'}]} }, 
                {
                  name: 'MeetingChatRoom',
                  params: { id }, 
                },
              ],
            },
          },
        ],
      })
  };

  const handleWebSocketMessage = (message) => {
    // 메시지 이벤트를 발생시키는 메서드
    EventEmitter.emit("newMessage", message);
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => setCategory(item)}>
        <Text>{item}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View>
      <TouchableOpacity onPress={selectImage}>
        <Text>사진url</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
      <Text>모임 이름</Text>
      
      <TextInput
        value={title}
        onChangeText={setTitle}/>
      <Text>모임 소개</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}/>
      <Text>참여 인원 수</Text>
      <TextInput
        value={capacity}
        onChangeText={setCapacity}/>
      <Text>키워드 선택</Text>
      <FlatList
        data={keyword}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <Text>날짜 선택</Text>
      <TextInput
        value={'2024-11-11'}
        onChangeText={setDate}
        />
      <Text>장소 선택</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}/>
      <TouchableOpacity
        onPress={createMeeting}>
        <Text>생성하기</Text>
      </TouchableOpacity>
    </View>
  )
};

export default MeetingCreate;