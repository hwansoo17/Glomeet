import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { api } from '../../api';
const emailRegEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
//const emailRegEx = /^[a-zA-Z0-9]+@ajou\.ac\.kr
const EmailAuthScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [randomCode, setRandomCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isButtonactive, setButtonactive] = useState(false);  

  const changeButtonStatus = () => {
    if (email != '') {
      setButtonactive(true);
    } else {
      setButtonactive(false);
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
          const code = createRandomCode()
          console.log(code);
          try {
            const response = await api.post('/mail/auth', {email, randomCode: code});
            if (response.status == 200) {
              console.log(code);
              console.log(response.status);
              setRandomCode(code);
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
  const checkAuthCode = () => {
    console.log(randomCode, authCode);
    if (randomCode == authCode) {
      navigation.navigate('Register', {email: email});
    } else {
      Alert.alert('인증번호가 일치하지 않습니다.');
    }
  };
  return (
    <View>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
        <TextInput placeholder="이메일" value={email} onChangeText={setEmail} />
        <TouchableOpacity 
          onPress={AuthCodeSend}
          disabled={!isButtonactive}>
          <Text>인증번호 받기</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
        <TextInput placeholder="인증번호" value={authCode} onChangeText={setAuthCode}/>
        <TouchableOpacity 
          onPress={checkAuthCode}>
          <Text>인증번호 확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  
}; 

export default EmailAuthScreen;