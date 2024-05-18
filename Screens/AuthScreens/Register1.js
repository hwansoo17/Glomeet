import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet,Image,SafeAreaView,ScrollView } from "react-native";
import { api } from '../../api';
import Logo from '../../assets/Glomeet_logo.svg';
import LineInput from "../../customComponents/LineInput";
import InputBox from "../../customComponents/InputBox";
import MainButton from "../../customComponents/MainButton";
import { useTranslation } from "react-i18next";
const emailRegEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

//const emailRegEx = /^[a-zA-Z0-9]+@ajou\.ac\.kr
const Register1 = ({navigation}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);;
  const [authCode, setAuthCode] = useState('');
  const [isButtonActive, setButtonActive] = useState(false);  
  const [isCheckButtonActive, setCheckButtonActive] = useState(false); 
  const [isSending, setIsSending] = useState(false);
  const [sendComplete, setSendComplete] = useState(false);
  const changeButtonStatus = () => {
    if (email != '') {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }
  };

  useEffect(() => {
    changeButtonStatus();
    setEmailValid(emailRegEx.test(email));
  }, [email]);
  const changeCheckButtonStatus = () => {
    if (authCode != '') {
      setCheckButtonActive(true);
    } else {
      setCheckButtonActive(false);
    }
  };
  useEffect (() => {
    changeCheckButtonStatus();
    
  },[authCode]) // 인증번호 확인할 때 활성화 되도록 수정

  const AuthCodeSend = async () => {
    console.log(email)
    if (!emailValid) {
      Alert.alert(t("register.emailinvalid"));
      return;
    }
    setIsSending(true); // 전송 시작 시 비활성화
    try {
      const response = await api.post('/auth/emailCheck', {email})
      console.log(response.status);
      setButtonActive(false);
        if (response.status == 200) {
          try {
            const response = await api.post('/mail/auth', {email});
            if (response.status == 200) {
              console.log(response.status);
              Alert.alert(t("register.sentcode"));
              setSendComplete(true)
            };
          } catch (error) {
            if (error.response.status == 400) {
            console.log()
            console.log(error, '인증번호');
            Alert.alert(error.response.data.message);
            } else {
              console.log(error);
              Alert.alert(t("register.sentcodefailed"));
            };
          };
        };
    } catch (error) {
      if (error.response.status == 409) {
      Alert.alert(t("register.alreadyregistered"));
      console.log(error);
      };
    };
    setIsSending(false); // 요청 완료 후 활성화
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
        Alert.alert(t("register.verificationfailed"));
      };
    };
  };
  return (  
    <View style={styles.container}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 20 }}>
        <View style={{height: 10}}/>
        <View style={{ flexDirection: 'row'}}>
          <View style={{ flex: 10 }}>
            <LineInput
              style={[!isSending && !sendComplete ? {} : {color:"#868686"}]}
              value={email}
              onChangeText={setEmail}
              placeholder={t("register.emailinput")}
              editable={!isSending && !sendComplete}
            />
          </View>
          <View style={{ flex: 0.5}}/>
          <View style={{ flex: 5 }}>
            <MainButton 
              title = {t("register.sendcode")}
              onPress = {AuthCodeSend}
              disabled ={!isButtonActive || isSending}
              style = {{borderRadius:5}}
              textStyle={{fontSize:14}}
            />
          </View>
        </View>
        <View style={{height: 10}}/> 

        <View style={{ flexDirection: 'row'}}>
          <View style={{ flex: 10 }}>
            <LineInput 
              value={authCode}
              onChangeText={setAuthCode}
              placeholder={t("register.entercode")}
            />
          </View>
          <View style={{ flex: 0.5 }}/>
          <View style={{ flex: 5}}>
            <MainButton 
                title = {t("register.submitcode")}
                onPress = {checkAuthCode}
                disabled ={!isCheckButtonActive}
                style = {{borderRadius:5}}
                textStyle={{fontSize:14}}
              />
          </View>
        </View> 
        <TouchableOpacity onPress={()=> navigation.navigate('Register2', {email: "hhhh"})}><Text style={{color:"#000"}}>123</Text></TouchableOpacity>
      </View>
      <View style={{ flex: 1}} /> 
    </View>
    {/* <TouchableOpacity onPress={() => navigation.navigate('Register2',{email:email})}><Text>asdasd</Text></TouchableOpacity> */}
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
    height: 50,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default Register1;