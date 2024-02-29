import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet,Image } from "react-native";
import { api } from '../../api';
const emailRegEx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
//const emailRegEx = /^[a-zA-Z0-9]+@ajou\.ac\.kr
const EmailAuthScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [randomCode, setRandomCode] = useState('');
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
      const response = await api.post('/auth/emailCheck', {email})
      console.log(response.status);
        if (response.status == 200) {
          const code = createRandomCode()
          console.log(code);
          try {
            const response = await api.post('/mail/auth', {email, randomCode: code});
            if (response.status == 200) {
              console.log(code);
              console.log(response.status);
              setRandomCode(code);
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
      if (error.response.status == 409) {
      Alert.alert('이미 가입된 이메일입니다.');
      console.log(error);
      };
    };
  };
  const checkAuthCode = () => {
    console.log(randomCode, authCode);
    if (randomCode == authCode) {
      navigation.navigate('Register', {email: email});
    } else {
      Alert.alert('인증번호가 일치하지 않습니다.');
    }
  };
  return (
    <><View style={styles.imageContainer}>
      <Image
        source={require('../../assets/ajou_logo.png')}
        style={styles.imageStyle}
        accessibilityRole="image"
        accessibilityLabel="아주대학교 로고"
        resizeMode="contain" />
    </View>
    <View>
        <View style={styles.inputContainer}>
          <TextInput placeholder="아주이메일 주소 입력" value={email} onChangeText={setEmail} style={styles.input} />
          <TouchableOpacity
            onPress={AuthCodeSend}
            disabled={!isButtonActive}
            style={[styles.button, isButtonActive ? styles.activeButton : styles.disabledButton]}>
            <Text style={styles.buttonText}>인증번호 받기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput placeholder="인증번호 입력" value={authCode} onChangeText={setAuthCode} style={styles.input} />
          <TouchableOpacity
            onPress={checkAuthCode}
            style={styles.button}>
            <Text style={styles.buttonText}>인증번호 확인</Text>
          </TouchableOpacity>
        </View>
      </View><View style={styles.linkText}>
        <TouchableOpacity onPress={() => navigation.navigate('Register', { email: email })}>
          <Text style={styles.linkText}>등록화면</Text>
        </TouchableOpacity>
      </View></>
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
export default EmailAuthScreen;