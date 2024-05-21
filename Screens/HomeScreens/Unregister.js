import React, {useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainButton from "../../customComponents/MainButton";
import { useTranslation } from "react-i18next";
import CheckBox  from '../../assets/CheckedBox.svg'
import { authApi } from "../../api";
import { assets } from "../../react-native.config";
const Unregister = ({navigation}) => {
  const [isChecked, setIsChecked] = useState(false);
  const {t} = useTranslation()
  const unregister = async() => {
    try {
      const response = await authApi.delete("/user/delete")
      if  (response.status == 200) {
        await AsyncStorage.removeItem('email')
        await AsyncStorage.removeItem('accessToken')
        await webSocketClient.logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }]
        });
      }
    } catch (e) {
      console.error(e.response.status);
    }
  }
  return (
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}/>
        <View style={{flex:8}}>
        <View style={{ height:20}}/>
          <Text style={{fontSize: 16, fontFamily:"Pretendard-Medium", color: "#000", textAlign:'center'}}>{t("homemain.mypage.unregisterNotice")}</Text>
          <Text style={{fontSize: 16, fontFamily:"Pretendard-Medium", color: "#000"}}></Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily:"Pretendard-Medium", color: "#666"}}>{t("homemain.mypage.agree")}</Text>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsChecked(!isChecked)}>
              {isChecked ? (<CheckBox/>):(<View style={styles.checkbox}/>) }
            </TouchableOpacity>
          </View>
          <MainButton
          title={t("homemain.mypage.unregister")}
          onPress={() => unregister()}
          disabled={!isChecked}/>
        </View>
        <View style={{flex:1}}/>
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
    checkboxContainer: {
      width: 30,
      height: 30,
  
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#B0B0B0',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,}
  });
export default Unregister;
