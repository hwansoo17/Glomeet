import React, { useEffect, useLayoutEffect } from 'react';
import { useState } from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useWebSocket } from "../../WebSocketProvider";
import { api, formDataApi } from '../../api'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CameraIcon from '../../assets/cameraIcon.svg';
import { useTranslation } from "react-i18next";
import i18n from '../../locales/i18n'
import ImageResizer from '@bam.tech/react-native-image-resizer';

const EditProfile = ({navigation, route}) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [imageFile, setImageFile] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const userProfile = route.params.userProfile;

  const resizeImage = async(image) => {
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
        const source = { uri: response.assets[0].uri };
        setImageUri(source.uri);
        setImageFile(imageFile);
        setDisabled(false)
      }
    });
  };
  const profileImageUpload = async() => {
    setDisabled(true)
    try{
      const formData = new FormData();

      formData.append('image', {
        uri: imageFile.uri,
        type: "image/jpeg",
        name: imageFile.name
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
  const setLocale = async(language) => {
    await AsyncStorage.setItem('locale', language);
    setLanguage(language)
    i18n.changeLanguage(language);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => profileImageUpload()}
          disabled={disabled}
        >
          <Text  style={{paddingTop:2, fontSize:14, fontFamily: 'Pretendard-SemiBold', color: !disabled ? '#09111F' : '#D3D3D3'}}>{t("homemain.mypage.apply")}</Text>
        </TouchableOpacity>
      ),
    });
  }, [disabled, t, imageFile]);
  return (
    <View style={{flex:1, backgroundColor:'#fff', padding:10}}>
      <View style={{flex:1}}/>
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
        <Text style={{fontFamily:"Pretendard-Medium", fontSize: 14, color: '#fff'}}>{t("homemain.mypage.changeProfileImage")}</Text>
      </TouchableOpacity>
      <View style={{flex:4}}/>
      <View style={{flexDirection: 'row', justifyContent:'center'}}>
        <TouchableOpacity
        style={[language == 'ko' ? styles.selectedLanguageBox : styles.languageBox]}
        onPress={() => setLocale('ko')}
        >
          <Text style={[language == 'ko' ? styles.selectedLanguageText : styles.languageText]}>한국어</Text>
        </TouchableOpacity>
        <View style={{width: 20}}/>
        <TouchableOpacity
        style={[language == 'en' ? styles.selectedLanguageBox : styles.languageBox]}
        onPress={() => setLocale('en')}
        >
          <Text style={[language == 'en' ? styles.selectedLanguageText : styles.languageText]}>English</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex:8}}/>
      <View>
        <Text style={{fontFamily:"Pretendard-Bold", fontSize: 20, color: '#000'}}>{t("homemain.mypage.account")}</Text>
        <TouchableOpacity
        style={styles.accountBox}
        onPress={() => loggedOut()}
        >
          <Text style={{fontFamily:"Pretendard-regular", fontSize: 16, color: '#000'}}>{t("homemain.mypage.logout")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.accountBox}
        onPress={() => navigation.navigate("Unregister")}
        >
          <Text style={{fontFamily:"Pretendard-regular", fontSize: 16, color: '#000'}}>{t("homemain.mypage.unregister")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  languageBox: {
    backgroundColor: '#fff', 
    width: 70, 
    paddingVertical:6, 
    borderRadius:10, 
    justifyContent:"center", 
    borderColor: "#5782F1", 
    borderWidth:2, 
    alignItems: "center"
  },
  selectedLanguageBox: {
    backgroundColor: '#5782F1', 
    width: 70, 
    paddingVertical:6, 
    borderRadius:10, 
    justifyContent:"center", 
    borderColor: "#5782F1", 
    borderWidth:2, 
    alignItems: "center"
  },
  languageText: {
    fontFamily:"Pretendard-SemiBold", fontSize: 14, color: '#5782F1'
  },
  selectedLanguageText: {
    fontFamily:"Pretendard-SemiBold", fontSize: 14, color: '#fff'
  },
  accountBox: {
    height: 40,
    paddingVertical:6, 
    borderRadius:10, 
    justifyContent:"center",  
  }
});

export default EditProfile;