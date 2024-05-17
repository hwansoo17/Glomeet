import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet,SafeAreaView,ScrollView   } from "react-native";
import { api } from '../../api';
import LineInput from "../../customComponents/LineInput";
import InputBox from "../../customComponents/InputBox";
import MainButton from "../../customComponents/MainButton";
import { useTranslation } from "react-i18next";
const Register2 = ({route, navigation}) => {
  const {t} = useTranslation()
  const {email} = route.params;
  const [nickName, setNickName] = useState('');
  const [serverNickName, setServerNickName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isButtonActive, setButtonactive] = useState(false);
  const [isDuplicateButtonActive, setDuplicateButtonActive] = useState(false); // 중복확인 버튼 활성화
  const doubleCheckName = async (nickName) => {
    try {
      const response = await api.post('/auth/nickNameCheck', {nickName : nickName});
      console.log(response.status);
      if (response.status == 200) {
        Alert.alert(t("register.nicknameAvailable"));
        setServerNickName(nickName)
      } 
    } catch (error) {
      if (error.response.status == 409) {
        Alert.alert(t("register.nicknameUnavailable"));
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
  useEffect(() => {
    console.log(serverNickName);
  },[serverNickName])
  const signUp = async () => {
    if (password === passwordCheck) {
      try {
        const response = await api.post('/auth/signUp', {email, serverNickName, password});
        if (response.status == 200) {
          Alert.alert(t("register.signupComplete"));
          navigation.navigate('Login');
        }
      } catch (error) {
        if (error.response.status == 409) {
          Alert.alert(t("register.signupfailed"));
        } 
      }
    } else {
      Alert.alert(t("register.passwordCheckFailed"));    
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
                  placeholder={t("register.nickNameinput")}
                />
            </View>
            <View style={{flex:0.5}}/>  
            <View style={{ flex: 3}}>
              <MainButton
                title={t("register.duplicateCheck")}
                onPress={() => doubleCheckName(nickName)}
                style={{borderRadius: 5}}
                textStyle={{fontSize: 16}}
                disabled={!isDuplicateButtonActive}
              />
            </View> 
          </View>
          <Text style={{fontFamily: "pretendard-Medium", color:"#868686",fontSize:14, paddingVertical:10}}>{serverNickName}</Text>
          <View style={{height: 10}}/>
          <LineInput 
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder= {t("register.passwordinput")}
            />
          <LineInput 
              value={passwordCheck}
              onChangeText={setPasswordCheck}
              secureTextEntry={true}
              placeholder= {t("register.passwordcheckinput")}
            /> 
          <View style={{height: 20}}/>
          <MainButton
            title={t("register.signup")}
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