import React, { useEffect, useLayoutEffect } from 'react';
import { useState } from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useWebSocket } from "../../WebSocketProvider";
import { api, formDataApi } from '../../api'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CameraIcon from '../../assets/cameraIcon.svg';

const EditProfile = ({navigation, route}) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const userProfile = route.params.userProfile;
  useEffect(() => {
    console.log(userProfile);
  },[])
  const webSocketClient = useWebSocket();
  const loggedOut = async () => {
    const email = await AsyncStorage.getItem('email');
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    try {
      const response = await api.post('/auth/signOut', {email: email, fcmToken: fcmToken})
      if (response.status == 200) {
        await AsyncStorage.removeItem('email')
        await AsyncStorage.removeItem('accessToken')
        await webSocketClient.logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }]
        });
      };
    } catch (error) {
     console.error(error.response.status);
    };
  };
  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const imageFile = response.assets[0];
        const source = { uri: response.assets[0].uri };
        setImageUri(source.uri);
        setImageFile(imageFile);
        setDisabled(false)
      }
    });
  };
  const profileImageUpload = async() => {
    try{
      const formData = new FormData();

      formData.append('image', {
        uri: imageFile.uri,
        type: imageFile.type,
        name: imageFile.fileName
      });
      const response = await formDataApi.post('/upload/profile/image', formData)
      if (response.status == 200) {
        console.log(response.status)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Root' }]
        });
      };
    } catch (error) {
      console.error(error);
    };
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => profileImageUpload()}
          disabled={disabled}
        >
          <Text  style={{paddingTop:2, fontSize:14, fontFamily: 'Pretendard-SemiBold', color: !disabled ? '#09111F' : '#D3D3D3'}}>적용하기</Text>
        </TouchableOpacity>
      ),
    });
  }, [disabled]);
  return (
    <View style={{flex:1, backgroundColor:'#fff', padding:10}}>
      <View style={{flex:2}}/>
      <Text style={{alignSelf: 'center',fontFamily:"GmarketSansTTFBold", fontSize: 30, color: '#5782F1'}}>{userProfile.nickName}</Text>
      <View style={{flex:1}}/>
      <View style={{width: 180, height: 180, backgroundColor: '#EEF3FF', borderRadius: 90, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center',  overflow: 'hidden'}}> 
        {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: 180, height: 180, borderRadius: 10, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center' }}/>
        ) : (
        <Image source={{ uri: userProfile.imageAddress }} style={{ width: 180, height: 180, borderRadius: 10, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center' }}/>
        )}
      </View>
      <View style={{flex:1}}/>
      <TouchableOpacity
      style={{alignSelf: 'center', padding:12, borderRadius:10, backgroundColor: '#5782F1'}}
      onPress={selectImage}
      >
        <Text style={{fontFamily:"Pretendard-Medium", fontSize: 14, color: '#fff'}}>프로필사진 변경</Text>
      </TouchableOpacity>
      <View style={{flex:20}}/>
      <TouchableOpacity
      style={{alignSelf: 'flex-end'}}
      onPress={() => loggedOut()}
      >
        <Text style={{fontFamily:"Pretendard-Medium", fontSize: 14, color: '#EC3232', margin:10}}tyle={{fontFamily:"Pretendard-Medium", fontSize: 14, color: '#fff'}}>로그아웃</Text>
      </TouchableOpacity>
      <View style={{flex:1}}/>
    </View>
  );
};

export default EditProfile;