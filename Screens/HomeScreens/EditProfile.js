import React from 'react';
import { useState } from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useWebSocket } from "../../WebSocketProvider";
import { api, formDataApi } from '../../api'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CameraIcon from '../../assets/cameraIcon.svg';

const EditProfile = ({navigation}) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUri, setImageUri] = useState(null);

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
      console.error(error.response.status);
    };
  }

  return (
    <View>
      <Text>MainScreen</Text>
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
      <TouchableOpacity
      onPress={() => profileImageUpload()}
      >
        <Text>프로필사진 변경</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => loggedOut()}
      >
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;