import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding5 = ({navigation}) => {

  
  return (
  <View>
    <TouchableOpacity
      onPress={() => navigation.navigate('Root', {screen: 'Home'})}>
      <Text>시작하기</Text>
    </TouchableOpacity>
    
  </View>

  )
};
export default OnBoarding5;