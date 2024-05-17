import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet,SafeAreaView,ScrollView   } from "react-native";
import { api } from '../../api';
import LineInput from "../../customComponents/LineInput";
import InputBox from "../../customComponents/InputBox";
import MainButton from "../../customComponents/MainButton";
const Register2 = ({route, navigation}) => {
  const {email} = route.params;
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isButtonActive, setButtonactive] = useState(false);
  const [isDuplicateButtonActive, setDuplicateButtonActive] = useState(false); // 중복확인 버튼 활성화
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
  const changeDupButtonStatus = () => {
    if (nickName != '') {
      setDuplicateButtonActive(true);
    } else {
      setDuplicateButtonActive(false);
    }
  };
  useEffect(() => {
    changeDupButtonStatus();
  }, [nickName]); // 중복확인 버튼을 닉네임 값이 바뀌었을 때 활성화

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
  <SafeAreaView style={styles.container}>
    <ScrollView style={{flex:1}}>
     <View style={{height: 10}}/> 
      <View style={{flexDirection: 'row'}}>
        <View style={{flex:1}}/>
        <View style={{flex:10}}>
        <View style={{ flexDirection: 'row'}}>
          <View style={{ flex: 7 }}>  
            <LineInput 
              value={nickName}
              onChangeText={setNickName}
              placeholder="사용할 닉네임을 입력해주세요."
            />
            </View>
            <View style={{flex:0.5}}/>  
          <View style={{ flex: 3}}>
          <MainButton
            title={'중복확인'}
            onPress={doubleCheckName}
            style={{borderRadius: 5}}
            textStyle={{fontSize: 16}}
            disabled={!isDuplicateButtonActive}
          />
        </View> 
        </View> 
          <View style={{height: 10}}/>
          <LineInput 
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder= '사용할 비밀번호를 입력해주세요.'
            />
          <LineInput 
              value={passwordCheck}
              onChangeText={setPasswordCheck}
              secureTextEntry={true}
              placeholder= '비밀번호 확인'
            /> 
          <View style={{height: 20}}/>
          <MainButton
            title={'회원가입'}
            onPress={signUp}
            disabled={!isButtonActive}
            />
        </View> 
        <View style={{flex:1}}/>
      </View>
    </ScrollView>
  </SafeAreaView>
      )
};
    
const styles = StyleSheet.create({
container: {
  flex:1,
  backgroundColor: 'white',
},
input: {
  height: 50,
  borderWidth: 1,
  borderColor: '#887E7E',
  borderRadius: 5,
  paddingHorizontal: 10,
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

export default Register2;