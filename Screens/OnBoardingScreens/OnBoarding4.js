import React ,{useState} from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding4 = ({navigation}) => {
  const [userPersonalType, setUserPersonalType] = useState('')
  const personalTypeData = ['외향적', '내향적']
  const savePersonalType = async() => {
    await AsyncStorage.setItem('userPersonalType', userPersonalType)
    const email = await AsyncStorage.getItem('email')
    const nickName = await AsyncStorage.getItem('nickName')
    const userContinent = await AsyncStorage.getItem('userContinent')
    const userHobby = await AsyncStorage.getItem('userHobby')
    console.log(email, nickName, userContinent, userHobby, userPersonalType)
    navigation.navigate('OnBoarding5')
  }  
  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => setUserPersonalType(item)}>
        <Text>{item}</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
  <View>
    <Text>당신의 성향은 무엇인가요</Text>
    <FlatList
      data={personalTypeData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
    <TouchableOpacity
      onPress={savePersonalType}>
      <Text>다음으로 넘어가기</Text>
    </TouchableOpacity>
  </View>

  )
};
export default OnBoarding4;