import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { api } from '../../api';
import LineInput from "../../customComponents/LineInput";
import MainButton from "../../customComponents/MainButton";
import { useTranslation } from "react-i18next";
const emailRegEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const PasswordReset1 = ({navigation}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
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
    setIsSending(true);
    try {
      const response = await api.post('/auth/emailRegisteredCheck', {email: email})
      console.log(response.status);
        if (response.status == 200) {
          try {
            const response = await api.post('/mail/auth', {email});
            if (response.status == 200) {
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
      if (error.response.status == 401) {
      Alert.alert(t("register.notRegistered"));
      console.log(error);
      };
    };
    setIsSending(false);
  };
  const checkAuthCode = async() => {
    try {
      const response = await api.post('/auth/verification-check', {email: email, randomCode: authCode})
      console.log(response.status);
      if (response.status == 200) {
        navigation.navigate('PasswordReset2', {email: email});

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
        <View style={{ flex: 10 }}>
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
                textStyle={{fontSize:15}}
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
                textStyle={{fontSize:15}}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
  },
});
export default PasswordReset1;