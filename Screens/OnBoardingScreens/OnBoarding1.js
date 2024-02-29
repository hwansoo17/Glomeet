import React, {useState} from "react";
import {View, Text, TouchableOpacity, TextInput} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding1 = ({navigation}) => {
  const [nickName, setNickName] = useState('');
  const saveNickName = async () => {
    await AsyncStorage.setItem('nickName', nickName);
    navigation.navigate('OnBoarding2');
  };  
  return (
    <View>
      <Text>반가워요!</Text>
      <Text>프로필 선택 후 이름을 입력해주세요</Text>
      <TextInput
        placeholder="닉네임"
        value={nickName}
        onChangeText={setNickName}/>
      <TouchableOpacity
        onPress={saveNickName}>
        <Text>
          다음으로 넘어가기
        </Text>
      </TouchableOpacity>
    </View>
  )
};

export default OnBoarding1;
