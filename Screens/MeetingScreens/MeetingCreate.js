import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet, ImageBackground, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formDataApi } from "../../api";
import { useWebSocket } from '../../WebSocketProvider'
import {launchImageLibrary} from 'react-native-image-picker';
import CameraIcon from '../../assets/cameraIcon.svg';
import LineInput from "../../customComponents/LineInput";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useTranslation } from "react-i18next";
const MeetingCreate = ({navigation}) => {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState(null);
  const [imageUri, setImageUri] = useState(null); // 상태 추가
  const [capacity, setCapacity] = useState('4')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isCreateEnabled, setIsCreateEnabled] = useState(true);
  const keyword = ['운동', '여행', '게임', '문화', '음식', '언어']
  const {publish} = useWebSocket();
  const dataSource = Array.from({ length: 28 }, (_, i) => (i + 3).toString())
  
  useEffect(() => {
    if (title != '' && description != '' && category != '' && imageFile!= null) {
      setIsCreateEnabled(true);
    } else {
      setIsCreateEnabled(false);
    }
  }, [title, description, category, capacity, imageFile]);
  const resizeImage = async (image) => {
    const resizedImage = await ImageResizer.createResizedImage(
      image.uri,
      1200, 
      1200, 
      'JPEG', 
      100
      );
    console.log(resizedImage, '이미지 리사이즈')
    return resizedImage;
  }
  const selectImage = async() => {
    launchImageLibrary({mediaType: 'photo'}, async(response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const originalImage = response.assets[0]
        // console.log('Original image: ', originalImage)
        const imageFile = await resizeImage(response.assets[0])
        console.log('Resized image: ', imageFile)
        const source = { uri: response.assets[0].uri };
        setImageUri(source.uri);
        setImageFile(imageFile);
      }
    });
  };

  const createMeeting = async() => {
    setIsCreateEnabled(false)
    console.log(imageFile, capacity, title, description, category)    
    try{
      const nickName = await AsyncStorage.getItem('nickName')
      const email = await AsyncStorage.getItem('email')
      const formData = new FormData();
      if (imageFile == null) {
        formData.append('image', null)
      } else {
        formData.append('image', {
          uri: imageFile.uri,
          type: "image/jpeg",
          name: imageFile.name
        });
      }
      formData.append('title', title);
      formData.append('comment', description);
      formData.append('capacity', capacity);
      formData.append('category', category);
      console.log(formData, '폼데이터')
      console.log(imageFile, '이미지 파일')
      const response = await formDataApi.post('/meeting/create', formData)
    if (response.status == 200) {
      console.log(response.data)
      console.log('@@@@')
      goChatRoom(response.data.id, title)
      Alert.alert(t("meetingCreate.meetingCreated"))
      publish("/pub/chat/"+ response.data.id, "application/json", email, nickName, response.data.id, "", "CREATE")
    }
    } catch (error) {
      console.log(error.response, '무슨 오류일까')
      if (error.response.status == 401) {
        console.log(error, '왜 오류?')
        setIsCreateEnabled(true)
      };
      if (error.response.status == 400) {
       console.log(error, '무슨 오류')
       setIsCreateEnabled(true)
      }
    };
  };
  const goChatRoom = (id, title) => {
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
                  params: { chat: {id, title} }, 
                },
              ],
            },
          },
        ],
      })
  };
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => setCategory(item)}
      style={[{backgroundColor: '#D1DCFB', paddingHorizontal:20, paddingVertical:7, borderRadius:10}, category == item && {backgroundColor: '#5782F1'}]}
    >
      <Text style={[{fontSize:14, fontFamily: 'Pretendard-Regular', color: '#6B7079'}, category == item && { color: '#ffffff'}]}>{t(`category.${item}`)}</Text>
    </TouchableOpacity>
  )
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={createMeeting}
          disabled={!isCreateEnabled}>
          <Text  style={{paddingTop:2, fontSize:14, fontFamily: 'Pretendard-SemiBold', color: isCreateEnabled ? '#09111F' : '#D3D3D3'}}> {t("meetingCreate.createMeeting")} </Text>
        </TouchableOpacity>
      ),
    });
  }, [isCreateEnabled, imageFile, title, description, category, capacity]);

  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
      >
        <View style={{padding:20}}>
          <View style={{height:20}}/>
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
            <Text style={styles.title}>{t("meetingCreate.meetingName")}</Text>
            <View style={{flex:1}}/>
            <Text style={styles.contentsLength}>{title.length}/30</Text>
          </View>
          <LineInput
            value={title}
            onChangeText={setTitle}
            placeholder={t("meetingCreate.NameContent")}
            placeholderTextColor={'#D3D3D3'}
            maxLength={30}/>
            <View style={{height:30}}/>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>{t("meetingCreate.meetingDescription")}</Text>
            <View style={{flex:1}}/>
            <Text style={styles.contentsLength}>{description.length}/120</Text>
          </View>
          <LineInput
            value={description}
            onChangeText={setDescription}
            placeholder={t("meetingCreate.DescriptionContent")}
            placeholderTextColor={'#D3D3D3'}
            maxLength={120}
            multiline={true}
            style={{textAlignVertical: 'top'}}/>
          <View style={{height:30}}/>  
          <Text style={styles.title}>{t("meetingCreate.participants")}</Text>
          <View style={{height:5}}/>
          <View style={{paddingHorizontal: 80}}>
            <ScrollPicker
              dataSource={dataSource}
              selectedIndex={1}
              onValueChange={setCapacity}
              wrapperHeight={120}
              wrapperBackground="#FFFFFF"
              itemHeight={40}
              highlightColor="#F0EFF2"
              highlightBorderWidth={1.2}
              activeItemTextStyle={{fontSize:18, fontFamily: 'Pretendard-Medium', color:'#25282B'}}
              itemTextStyle={{fontSize:18, fontFamily: 'Pretendard-Light', color:'#D3D3D3'}}
            />
          </View>
          <View style={{height:40}}/>
          <Text style={styles.title}>{t("meetingCreate.selectKeywords")}</Text>
          </View>
          <View>
            <FlatList
              data={keyword}
              renderItem={renderCategory}
              horizontal
              ListHeaderComponent={<View style={{width:20}}/>}
              ListFooterComponent={<View style={{width:10}}/>}
              ItemSeparatorComponent={<View style={{width:10}}/>}
              showsHorizontalScrollIndicator={false}
            />
          <View style={{height:100}}/>
        </View>
      </ScrollView>
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