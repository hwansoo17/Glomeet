import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet,Image,SafeAreaView,ScrollView } from "react-native";
import { api } from '../../api';
import Logo from '../../assets/Glomeet_logo.svg';
import InputBox from "../../customComponents/InputBox";
import MainButton from "../../customComponents/MainButton";
const emailRegEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

//const emailRegEx = /^[a-zA-Z0-9]+@ajou\.ac\.kr
const Register1 = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [randomCode, setRandomCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isButtonActive, setButtonActive] = useState(false);  

  const changeButtonStatus = () => {
    if (email != '') {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }
  };
  const createRandomCode = () => {
    return String(Math.floor(Math.random() * 1000000)).padStart(6, '0')  
  }

  useEffect(() => {
    changeButtonStatus();
    setEmailValid(emailRegEx.test(email));
  }, [email]);

  const AuthCodeSend = async () => {
    console.log(email)
    if (!emailValid) {
      Alert.alert('이메일 형식이 올바르지 않습니다.');
      return;
    } 
    try {
      const response = await api.post('/auth/emailCheck', {email})
      console.log(response.status);
        if (response.status == 200) {
          try {
            const response = await api.post('/mail/auth', {email});
            if (response.status == 200) {
              console.log(response.status);
              Alert.alert('인증번호가 전송되었습니다.');
            };
          } catch (error) {
            if (error.response.status == 400) {
            console.log()
            console.log(error, '인증번호');
            Alert.alert(error.response.data.message);
            } else {
              console.log(error);
              Alert.alert('인증번호 전송에 실패하였습니다.');
            };
          };
        };
    } catch (error) {
      if (error.response.status == 409) {
      Alert.alert('이미 가입된 이메일입니다.');
      console.log(error);
      };
    };
  };
  const checkAuthCode = async() => {
    try {
      const response = await api.post('/auth/verification-check', {email: email, randomCode: authCode})
      console.log(response.status);
      if (response.status == 200) {
        navigation.navigate('Register2', {email: email});

      };
    } catch (error) {
      if (error.response.status == 400) {
        console.log(error.response.status);
        Alert.alert('인증번호가 일치하지 않습니다.');
      };
    };
  };
  return (  
    <View style={styles.container}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: 0.5 }} />
      <View style={{ flex: 10 }}>
        <View style={{height: 10}}/>
        <View style={{ flexDirection: 'row'}}>
          <View style={{ flex: 9 }}>
            <InputBox 
              value={email}
              onChangeText={setEmail}
              placeholder="아주이메일 주소 입력"
            />
          </View>
          <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
          <MainButton 
            title= "인증번호 받기"
            style={styles.button}
            textStyle={{fontSize: 15, textAlign: 'center', textAlign: 'justify'}}
            onPress={AuthCodeSend}
            disabled={!isButtonActive}
          />
          </View>
        </View>
        <View style={{height: 10}}/> 

        <View style={{ flexDirection: 'row'}}>
          <View style={{ flex: 9 }}>
            <InputBox 
              value={authCode}
              onChangeText={setAuthCode}
              placeholder="인증번호 입력"
            />
          </View>
          <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
          <MainButton 
            title= "인증번호 확인"
            textStyle={{fontSize: 15, textAlign: 'center', textAlign: 'justify'}}
            onPress={AuthCodeSend}
            style={[styles.button]}
            disabled={false}
          />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Register2', { email: email })}>
            <Text>등록화면</Text>
          </TouchableOpacity>
      </View>
      <View style={{ flex: 0.5 }} />
    </View>
  </View>


  ) 
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#5782F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default Register1;