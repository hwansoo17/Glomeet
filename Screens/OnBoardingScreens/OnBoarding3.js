import React ,{useState} from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding3 = ({navigation}) => {
  const [userHobby, setUserHobby] = useState('')
  const hobbyData = ['운동', '여행', '게임', '문화', '음식', '언어']
  const saveHobby = async() => {
    await AsyncStorage.setItem('userHobby', userHobby)
    navigation.navigate('OnBoarding4')
  }   
    const renderItem = ({ item }) => (
      <View>
        <TouchableOpacity
          onPress={setUserHobby(item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      </View>
    );
    
    return (
    <View>
      <Text>당신은 관심사는 무엇인가요</Text>
      <FlatList
        data={hobbyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        onPress={saveHobby}>
        <Text>다음으로 넘어가기</Text>
      </TouchableOpacity>
    </View>

    )
  }
export default OnBoarding3;
