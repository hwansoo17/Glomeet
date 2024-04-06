import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet   } from "react-native";
import { api } from '../../api';

const Register2 = ({route, navigation}) => {
  const {email} = route.params;
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isButtonActive, setButtonactive] = useState(false);
  
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
      <View style={styles.inputContainer}>
        <View style={styles.borderContainer}>
          <TextInput placeholder="닉네임" value={nickName} onChangeText={setNickName} style={styles.nickNameText} />
          <TouchableOpacity onPress={doubleCheckName} style={styles.checkButton}>
           <Text style={styles.checkButtonText}>중복확인</Text>
          </TouchableOpacity>
        </View>
      </View>
          <TextInput
            placeholder="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.password} />
          <TextInput
            placeholder="비밀번호 확인"
            secureTextEntry
            value={passwordCheck}
            onChangeText={setPasswordCheck}
            style={styles.passwordCheck} />
          <View style = {styles.Register}>
          <TouchableOpacity
            onPress={signUp}
            disabled={!isButtonActive}
            style={[styles.Registerbutton, isButtonActive ? styles.activeButton : styles.disabledButton]}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      inputContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      borderContainer: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderWidth: 1,
        borderColor: '#887E7E',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 20,
      },
      nickNameText: {
        flex: 1,
        color: '#887E7E',
        fontSize: 14, 
        paddingVertical:-10,
      },
      checkButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
      checkButtonText: {
        color: '#5782F1', 
        fontSize: 14,
        fontWeight: "bold", 
      },
      Register: {
        flex:1,
        paddingHorizontal: 10,
        flexDirection: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical:10,
      },
      Registerbutton: {
        height: 50,
        width: 400,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      },
      activeButton: {
        marginTop: 10,
        backgroundColor: '#5782F1',
        paddingHorizontal: 20,
      },
      disabledButton: {
        marginTop: 10,
        backgroundColor: '#ccc',
        paddingHorizontal: 20,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
    
      },
      password: {
        color: "#887E7E",
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        marginBottom: 10,
        justifyContent: 'center',
        marginHorizontal: 10,
      },
      passwordCheck: {
        color: "#887E7E",
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        justifyContent: 'center',
        marginHorizontal: 10,
      }
    });
    
    export default Register2;