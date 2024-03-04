import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { api } from '../../api';
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
    <View>
      <Text>PasswordResetScreen</Text>
      <TextInput placeholder="이메일" value={email} onChangeText={setEmail} />
      <TouchableOpacity
        onPress={AuthCodeSend}
        disabled={!isButtonActive}
        style={[styles.button, isButtonActive ? styles.activeButton : styles.disabledButton]}>
        <Text style={styles.buttonText}>인증번호 받기</Text>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput placeholder="인증번호 입력" value={authCode} onChangeText={setAuthCode} style={styles.input} />
        <TouchableOpacity
          onPress={checkAuthCode}
          style={styles.button}>
          <Text style={styles.buttonText}>인증번호 확인</Text>
        </TouchableOpacity>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 30,
    marginBottom: 10,
    color: "#887E7E",
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
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
    color: '#fff',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: '#5782F1',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});
export default PasswordReset1;