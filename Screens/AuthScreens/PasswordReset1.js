import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { api } from '../../api';
import GlomeetLogo from "../../assets/logo.svg";
import { GlomeetText,InputBox  } from '../../CustomComponent';
const emailRegEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const PasswordReset1 = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isButtonActive, setButtonActive] = useState(false);  
  const changeButtonStatus = () => {
    if (email != '') {
      setButtonActive(true);
    } else {
      setButtonActive(false);
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
      const response = await api.post('/auth/emailRegisteredCheck', {email: email})
      console.log(response.status);
        if (response.status == 200) {
          try {
            const response = await api.post('/mail/auth', {email});
            if (response.status == 200) {
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
      if (error.response.status == 401) {
      Alert.alert('가입되지 않은 이메일입니다.');
      console.log(error);
      };
    };
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
        Alert.alert('인증번호가 일치하지 않습니다.');
      };
    };
  };
    return (
      <View style={styles.container}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 8 }}>
          <View style={styles.imageContainer}>
            <GlomeetLogo/>
            <GlomeetText/>
          </View>
          <View style={{height: 10}}/>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ flex: 6 }}>
              <InputBox 
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="아주이메일 주소 입력"
              />
            </View>
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={AuthCodeSend}
                disabled={!isButtonActive}
                style={[styles.button, isButtonActive ? styles.activeButton : styles.disabledButton]}
              >
                <Text style={styles.buttonText}>인증번호 받기</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: 10}}/> 

          <View style={{ flexDirection: 'row'}}>
            <View style={{ flex: 6 }}>
              <InputBox 
                value={authCode}
                onChangeText={setAuthCode}
                style={styles.input}
                placeholder="인증번호 입력"
              />
            </View>
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={checkAuthCode}
                disabled={!authCode || !isButtonActive}
                style={[styles.button, (!authCode || !isButtonActive) ? styles.disabledButton : styles.activeButton]}
              >
                <Text style={styles.buttonText}>인증번호 확인</Text>
              </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 30,
    color: "#887E7E",
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    
  },
  input: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 20,
  },
  activeButton: {
    backgroundColor: '#5782F1',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: 13,
  },
  linkText: {
    color: '#5782F1',
    fontSize: 16,
  },
  imageContainer: {
    
    alignItems: 'center',
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});
export default PasswordReset1;