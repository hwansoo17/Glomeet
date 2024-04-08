import React, { useState, useLayoutEffect, useEffect } from "react";
import {View, Text, TouchableOpacity, TextInput, FlatList, Alert, Image, ScrollView, StyleSheet, ImageBackground} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from '../../WebSocketProvider'
import EventEmitter from "react-native-eventemitter";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CameraIcon from '../../assets/cameraIcon.svg';
import MainButton from "../../customComponents/MainButton";
import LineInput from "../../customComponents/LineInput";
import ScrollPicker from "react-native-wheel-scrollview-picker";


const MeetingCreate = ({navigation}) => {
  const [url, setUrl] = useState('ㅋㅋㅋ')
  const [imageUri, setImageUri] = useState(null); // 상태 추가
  const [capacity, setCapacity] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isCreateEnabled, setIsCreateEnabled] = useState(false);
  const keyword = ['운동', '여행', '게임', '문화', '음식', '언어']
  const {publish} = useWebSocket();
  const dataSource = Array.from({ length: 18 }, (_, i) => (i + 3).toString())
  
  useEffect(() => {
    if (title != '' && description != '' && category != '') {
      setIsCreateEnabled(true);
    } else {
      setIsCreateEnabled(false);
    }
  }, [title, description,category]);
  
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
      const nickName = await AsyncStorage.getItem('nickName')
      const email = await AsyncStorage.getItem('email')
      const response = await authApi.post('/meeting/create', { url: url, title: title, comment: description, capacity: capacity, location: location, meetingDate: date, category: category})
    if (response.status == 200) {
      console.log(response.data)
      console.log('@@@@')
      
      goChatRoom(response.data)
      Alert.alert('모임이 생성되었습니다')
      publish("/pub/chat/"+ response.data.id, "application/json", email, nickName, response.data.id, "새 모임이 생성되었습니다.", "CREATE")
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
  const goChatRoom = (chat) => {
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
                  params: { chat }, 
                },
              ],
            },
          },
        ],
      })
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={createMeeting}
          disabled={!isCreateEnabled}>
          <Text  style={{paddingTop:2, fontSize:14, fontFamily: 'Pretendard-SemiBold', color: isCreateEnabled ? '#09111F' : '#D3D3D3'}}>모임 생성하기</Text>
        </TouchableOpacity>
      ),
    });
  }, [isCreateEnabled]);
  const handleWebSocketMessage = (message) => {
    // 메시지 이벤트를 발생시키는 메서드
    EventEmitter.emit("newMessage", message);
  };

  return (
    <View style={{flex:1, backgroundColor: '#fff', flexDirection: 'row'}}>
      <View style={{flex:1}}/>
      <View style={{flex:8}}>
        <View style={{flex:8}}>
          <ScrollView>
          <View style={{height:30}}/>
            <TouchableOpacity 
              style={{width: 180, height: 180, backgroundColor: '#EEF3FF', borderRadius: 10, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center',  overflow: 'hidden'}}
              onPress={selectImage}> 
              {imageUri ? (
              <ImageBackground source={{ uri: imageUri }} style={{ width: 180, height: 180, borderRadius: 10, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center' }}>
                <View style={{height:30, width:30, borderRadius:15, backgroundColor: '#5782F1', margin:10 }}>
                  <CameraIcon/>
                </View>
              </ImageBackground>
              ) : (
              <View style={{height:30, width:30, borderRadius:15, backgroundColor: '#5782F1', margin:10 }}>
                <CameraIcon/>
              </View>
              )}
            </TouchableOpacity>
            <View style={{height:30}}/>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>모임 이름</Text>
              <View style={{flex:1}}/>
              <Text style={styles.contentsLength}>{title.length}/20</Text>
            </View>
            <LineInput
              value={title}
              onChangeText={setTitle}
              placeholder={'모임 이름을 입력하세요.'}
              placeholderTextColor={'#D3D3D3'}
              maxLength={20}/>
              <View style={{height:30}}/>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>모임 소개</Text>
              <View style={{flex:1}}/>
              <Text style={styles.contentsLength}>{description.length}/80</Text>
            </View>
            <LineInput
              value={description}
              onChangeText={setDescription}
              placeholder={'모임 소개를 입력하세요.'}
              placeholderTextColor={'#D3D3D3'}
              maxLength={80}
              multiline={true}/>
            <View style={{height:30}}/>  
            <Text style={styles.title}>참여 인원 수</Text>
            <ScrollPicker
              dataSource={dataSource}
              selectedIndex={1}
              onValueChange={(data) => {
                setCapacity(data)
              }}
              wrapperHeight={100}
              wrapperBackground="#FFFFFF"
              itemHeight={40}
              highlightColor="#F0EFF2"
              highlightBorderWidth={1.2}
              activeItemTextStyle={{fontSize:18, fontFamily: 'Pretendard-Medium', color:'#25282B'}}
              itemTextStyle={{fontSize:18, fontFamily: 'Pretendard-Light'}}
            />
            <View style={{height:20}}/>
            <Text style={styles.title}>키워드 선택</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical:15, marginBottom:15  }}>
              {keyword.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[{backgroundColor: '#D1DCFB', paddingHorizontal:13, paddingVertical:5, borderRadius:10}, category == item && {backgroundColor: '#5782F1'}]}
              >
                <Text style={[{fontSize:12, fontFamily: 'Pretendard-Regular', color: '#6B7079'}, category == item && { color: '#ffffff'}]}>{item}</Text>
              </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={{flex:1}}/>
    </View>
  )
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#25282B',
  },
  contentsLength:{
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#D3D3D3',
  }
});

export default MeetingCreate;