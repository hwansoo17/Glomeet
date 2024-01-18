import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import config from '../../config';
const emailRegEx = /^[a-zA-Z0-9]+@ajou\.ac\.kr$/;
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
  useEffect(() => {
    changeButtonStatus();
    setEmailValid(emailRegEx.test(email));
  }, [email]);

  const AuthCodeSend = async () => {
    if (!emailValid) {
      Alert.alert('이메일 형식이 올바르지 않습니다.');
    } else {
      const response = await fetch(config.SERVER_URL+'/auth/emailCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email})
      });
      console.log(response.status);
      if (response.status == 200) {
        code = String (Math.floor(Math.random() * 1000000)).padStart(6, '0')
        setRandomCode(code);
        console.log(randomCode);
        const response = await fetch(config.SERVER_URL+'/mail/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: email, randomCode: code})
        });
        if (response.status == 200) {
          Alert.alert('인증번호가 전송되었습니다.');
        } else {
          Alert.alert('인증번호 전송에 실패하였습니다.');
        }
        console.log(code);
      }else {
        Alert.alert('이미 가입된 이메일입니다.');
      };
    };
  };
  console.log(email)
  console.log(authCode)
  const checkAuthCode = () => {
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