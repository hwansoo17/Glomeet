import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet,SafeAreaView,ScrollView    } from "react-native";
import { api } from '../../api';
import LineInput from "../../customComponents/LineInput";
import InputBox from "../../customComponents/InputBox";
import MainButton from "../../customComponents/MainButton";
const PasswordReset2 = ({route, navigation}) => {
  const {email} = route.params;
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isButtonActive, setButtonactive] = useState(false);
  
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

  const resetPassword = async () => {
    if (password === passwordCheck) {
      try {
        const response = await api.post('/auth/resetPassword', {email, password});
        if (response.status == 200) {
          Alert.alert('비밀번호 변경이 완료되었습니다.');
          navigation.navigate('Login');
        }
      } catch (error) {
        if (error.response.status == 409) {
          Alert.alert('비밀번호 변경에 실패하였습니다.');
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
          <View style={{height: 10}}/>
          <LineInput 
            placeholder="새로운 비밀번호"
            secureTextEntry = {true}
            value={password}
            onChangeText={setPassword}
            />
          <LineInput 
            placeholder="비밀번호 확인"
            secureTextEntry= {true}
            value={passwordCheck}
            onChangeText={setPasswordCheck}
            /> 
          <View style={{height: 20}}/>
          <MainButton
            title={'비밀번호 변경'}
            onPress={resetPassword}
            disabled={!isButtonActive}
            />
        </View> 
        <View style={{flex:1}}/>
      </View>
    </ScrollView>
  </SafeAreaView>  
      );
    }
    
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
  },
    });
    
    export default PasswordReset2;