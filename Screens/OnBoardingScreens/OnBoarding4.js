import React ,{useState} from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../api"
const OnBoarding4 = ({navigation}) => {
  const [userPersonalType, setUserPersonalType] = useState('')
  const personalTypeData = ['외향적', '내향적']
  const savePersonalType = async() => {
    const email = await AsyncStorage.getItem('email')
    const userContinent = await AsyncStorage.getItem('userContinent')
    const userHobby = await AsyncStorage.getItem('userHobby')
    try {
      const response = await api.post('/auth/inputAdditionalInfo', {email: email, country: userContinent, interest: userHobby, type: userPersonalType}) 
      if (response.status == 200) {
        console.log(email, userContinent, userHobby, userPersonalType)
        navigation.navigate('OnBoarding5')
      }; 
    } catch (error) {
      if (error.response.status == 409) {
        console.log(error.response.status);
      };
    }
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