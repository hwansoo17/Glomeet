import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";

const PasswordRegisterScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isButtonactive, setButtonactive] = useState(false);

  const changeButtonStatus = () => {
    if (password != '' && passwordCheck != '') {
      setButtonactive(true);
    } else {
      setButtonactive(false);
    }
  };
  useEffect(() => {
    changeButtonStatus();
  }, [password, passwordCheck]);

  const checkPasswordSame = () => {
    if (password === passwordCheck) {
      navigation.navigate('Login');
    } else {
      Alert.alert('비밀번호가 일치하지 않습니다.');
    }
  };

console.log(typeof(password));
  return (
    <View>
      <TextInput 
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}/>
      <TextInput 
        placeholder="비밀번호확인"
        secureTextEntry
        value={passwordCheck}
        onChangeText={setPasswordCheck}/>
      <TouchableOpacity 
        onPress={checkPasswordSame}
        disabled={!isButtonactive}>
        <Text>회원가입</Text>
      </TouchableOpacity>
    </View>
  )
  
}

export default PasswordRegisterScreen;