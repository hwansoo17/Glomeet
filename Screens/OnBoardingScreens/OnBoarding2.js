import React, {useState, useEffect}from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const OnBoarding2 = ({navigation}) => {
  const [userContinent, setUserContinent] = useState('')
  const continentData = ['아시아', '유럽', '북아메리카', '남아메리카', '오세아니아', '아프리카']
  const saveContinent = async() => {
      await AsyncStorage.setItem('userContinent', userContinent)
      navigation.navigate('OnBoarding3')
  }
  
  useEffect(() => {
    console.log(userContinent);
  }, [userContinent])

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => setUserContinent(item)}>
        <Text>{item}</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
  <View>
    <Text>당신은 어느 대륙 사람인가요</Text>
    <FlatList
      data={continentData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
    <TouchableOpacity
      onPress={saveContinent}>
      <Text>다음으로 넘어가기</Text>
    </TouchableOpacity>
  </View>

  )
};

export default OnBoarding2;
