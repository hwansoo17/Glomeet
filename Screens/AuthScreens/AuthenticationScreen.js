import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";

const AuthenticationScreen = ({navigation}) => {
  const [randomCode, setRandomCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isButtonactive, setButtonactive] = useState(false);
  
  const creatRandomCode = () => {
    setRandomCode(String (Math.floor(Math.random() * 1000000)).padStart(6, '0'));
  };
  useEffect(() => {
    creatRandomCode();
  }, []);

  const checkAuthCode = () => {
    if (randomCode == authCode) {
      navigation.navigate('PasswordRegister');
    } else {
      Alert.alert('인증번호가 일치하지 않습니다.');
    }
  };

  const changeButtonStatus = () => { 
    if (authCode != '') {
      setButtonactive(true);
    }
    else {
      setButtonactive(false);
    }
  };
  useEffect(() => {
    changeButtonStatus();
  }, [authCode]);

  console.log(authCode);
  console.log(randomCode);
  console.log(isButtonactive);
  return (
    <View>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
        <TextInput placeholder="인증번호" value={authCode} onChangeText={setAuthCode}/>
        <TouchableOpacity 
          onPress={checkAuthCode}
          disabled={!isButtonactive}>
          <Text>인증번호 확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  
};

export default AuthenticationScreen;