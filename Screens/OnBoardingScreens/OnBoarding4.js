import React from "react";
import {View, Text, TouchableOpacity, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding4 = ({navigation}) => {

  
  return (
  <SafeAreaView>
    <TouchableOpacity
      onPress={() => navigation.reset({
        index: 0,
        routes: [{ name: 'Root' }]
      })}>
      <Text>시작하기</Text>
    </TouchableOpacity>
    
  </SafeAreaView>

  )
};
export default OnBoarding4;