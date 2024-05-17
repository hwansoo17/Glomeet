import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert,StyleSheet,SafeAreaView,ScrollView    } from "react-native";
import { api } from '../../api';
import LineInput from "../../customComponents/LineInput";
import InputBox from "../../customComponents/InputBox";
import MainButton from "../../customComponents/MainButton";
import { useTranslation } from "react-i18next";
const PasswordReset2 = ({route, navigation}) => {
  const { t } = useTranslation();
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
          Alert.alert(t("register.passwordChangeComplete"));
          navigation.navigate('Login');
        }
      } catch (error) {
        if (error.response.status == 409) {
          Alert.alert(t("register.passwordChangeFailed"));
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
          <View style={{height: 10}}/>
          <LineInput 
            placeholder={t("register.newPassword")}
            secureTextEntry = {true}
            value={password}
            onChangeText={setPassword}
            />
          <LineInput 
            placeholder={t("register.passwordcheckinput")}
            secureTextEntry= {true}
            value={passwordCheck}
            onChangeText={setPasswordCheck}
            /> 
          <View style={{height: 20}}/>
          <MainButton
            title={t("register.passwordChange")}
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