import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView, ActivityIndicator, Modal} from 'react-native';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWebSocket } from "../../WebSocketProvider";
import { api } from '../../api';
import Logo from '../../assets/Glomeet_logo.svg';
import MainButton from '../../customComponents/MainButton';
import LineInput from '../../customComponents/LineInput';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
const LoginScreen = ({navigation}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const webSocketClient = useWebSocket();
  const [language, setLanguage] = useState(i18n.language);
  const login = async () => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
      Alert.alert(t('login.serverError'));
    }, 10000); // 10 seconds timeout
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      const response = await api.post('/auth/signIn', {email, password, fcmToken})
      clearTimeout(timeoutId);
      if (response.status == 200) {
        console.log('로그인 성공: ', response.data)
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('nickName', response.data.nickName)
        await AsyncStorage.setItem('accessToken', response.data.tokens.accessToken)
        await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        await webSocketClient.login();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Root' }]
        });
      }
      if (response.status == 201) {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('nickName', response.data.nickName)
        await AsyncStorage.setItem('accessToken', response.data.tokens.accessToken)
        await AsyncStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        await webSocketClient.login();
        navigation.reset({
          index: 0,
          routes: [{ name: 'OnBoard' }]
        });
      }
    } catch (error) {
      console.log(error.response);
      clearTimeout(timeoutId);
      if (error.response.status == 401) {
        console.log('로그인 실패: ', error);
        Alert.alert(t('login.loginfailed'));
      }
    } finally {
      setLoading(false); // Set loading to false when login completes
    }
  };
  const setLocale = async(language) => {
    await AsyncStorage.setItem('locale', language);
    setLanguage(language)
    i18n.changeLanguage(language);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex:1}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex:1}}/>
          <View style={{flex:8}}>
            <View style={{height: 10}}/>
            <View style={{alignItems: 'center'}}>
              <Logo width={120} height={120} color="#5782F1"/>
              {i18n.language === 'ko' ? (
              <Text style={{fontFamily: 'GmarketSansTTFMedium', fontSize: 18, textAlign: 'center', lineHeight: 24, color: '#000'}}>
                <Text style={{fontFamily: 'GmarketSansTTFBold'}}>유학생</Text>들을 위한{'\n'}취미기반 매칭서비스{' '}
                <Text style={{fontFamily: 'GmarketSansTTFBold', color: '#5782F1'}}>글로밋</Text>
              </Text>
            ) : (
              <Text style={{fontFamily: 'GmarketSansTTFMedium', fontSize: 16, textAlign: 'center', lineHeight: 24, color: '#000'}}>
                Matching Service for{'\n'}<Text style={{fontFamily: 'GmarketSansTTFBold'}}>International Students{' '}</Text>
                <Text style={{fontFamily: 'GmarketSansTTFBold', color: '#5782F1'}}>Glomeet</Text>
              </Text>
            )}
            </View>
            <View style={{height: 20}}/>
            <LineInput 
              placeholder={t("login.emailinput")}
              value={email}
              secureTextEntry ={false}
              onChangeText={setEmail}
            />
            <View style={{height: 10}}/>
            <LineInput 
              placeholder={t("login.passwordinput")}
              value={password}
              secureTextEntry ={true}
              onChangeText={setPassword}
            />
            <View style={{height: 20}}/>
            <MainButton onPress={login} title={t("login.login")}/>
            <View style={{height: 20}}/>
            <MainButton
              style={{backgroundColor: 'white', borderColor: '#5782F1', borderWidth:1.2}}
              textStyle={{color: '#5782F1'}}
              title={t("login.signup")}
              onPress={() => navigation.navigate('Register1')}/>
            <View style={{height: 10}}/>
            <TouchableOpacity
              style={{padding:10}}
              onPress={() => navigation.navigate('PasswordReset1')}>
              <Text style={styles.linkText}>{t("login.forgotpassword")}</Text>
            </TouchableOpacity>
            <View style={{height: 10}}/>
            <View style={{height: 10}}/>
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
          </View>
          <View style={{flex:1}}/>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading} // Show modal when loading is true
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View>
            <ActivityIndicator size="large" color="#5782F1" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
  },
  input: {
    fontFamily: 'Pretendard-Regular',
    height: 50,
    borderBottomWidth: 1.2,
    borderColor: '#887E7E',
  },
  button: {
    height: 50,
    backgroundColor: '#5782F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    color: '#868686',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
  selectLanguage: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#000',
  },
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
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoginScreen;
