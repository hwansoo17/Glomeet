import React, {useState} from "react";
import {View, Text, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding1 = ({navigation}) => {
  const [nickName, setNickName] = useState('');
  const saveNickName = async () => {
    await AsyncStorage.setItem('nickName', nickName);
    navigation.navigate('OnBoarding2');
  };  
  return (
    <View style={{flex:1}}>
      <View style={{flex:9}}>
        <Text>반가워요!</Text>
        <Text>프로필 선택 후 이름 입력해주세요</Text>
        <TextInput
          placeholder="닉네임"
          value={nickName}
          onChangeText={setNickName}/>
      </View>
      <View style={{flex:1, flexDirection: 'row'}}>
        <View style={{flex:1}}/>
        <TouchableOpacity
          style={styles.button}
          onPress={saveNickName}>
          <Text>
            다음으로 넘어가기
          </Text>
        </TouchableOpacity>
        <View style={{flex:1}}/>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
    button: {
      flex:18,
      backgroundColor: 'lightblue',
      borderRadius: 20, // 모서리를 둥글게 만들기 위해 사용하는 속성
      justifyContent: 'center'

    },
});
export default OnBoarding1;
