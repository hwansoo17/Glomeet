import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { api } from '../../api';

const RegisterScreen = ({route, navigation}) => {
  const {email} = route.params;
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isButtonactive, setButtonactive] = useState(false);
  
  const doubleCheckName = async () => {
    try {
      const response = await api.post('/auth/nickNameCheck', {nickName : nickName});
      console.log(response.status);
      if (response.status == 200) {
        Alert.alert('사용 가능한 닉네임입니다.');
      } 
    } catch (error) {
      if (error.response.status == 409) {
        Alert.alert('이미 사용중인 닉네임입니다.');
      console.log(error);
      };
    };
  };
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

  const signUp = async () => {
    if (password === passwordCheck) {
      try {
        const response = await api.post('/auth/signUp', {email, nickName, password});
        if (response.status == 200) {
          Alert.alert('회원가입이 완료되었습니다.');
          navigation.navigate('Login');
        }
      } catch (error) {
        if (error.response.status == 409) {
          Alert.alert('회원가입에 실패하였습니다.');
        } 
      }
    } else {
      Alert.alert('비밀번호가 일치하지 않습니다.');    
    };
  };

  return (
    <View>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
        <TextInput placeholder="닉네임" value={nickName} onChangeText={setNickName}/>
        <TouchableOpacity
          onPress={doubleCheckName}>
          <Text>닉네임 중복확인</Text>
        </TouchableOpacity>
      </View>
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
        onPress={signUp}
        disabled={!isButtonactive}>
        <Text>회원가입</Text>
      </TouchableOpacity>
    </View>
  )
  
}

export default RegisterScreen;