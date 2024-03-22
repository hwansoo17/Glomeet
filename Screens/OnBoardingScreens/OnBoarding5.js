import React, { useState, useEffect }from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from '../../CustomComponent';
import ReadyImg from '../../assets/readyimg.svg';
const OnBoarding5 = ({navigation}) => {
  const TEXTS = {
    TITLE: ['이제 친구를 만나러 갈 수 있어요'],
    SUBTITLE: ['글로밋 앱은 건전하고 건강한' ,'외국인 교류 문화를 만들어갑니다'],
  };
return (
  <View style={styles.container}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 8 }}>
        <View style={{ flex: 1 }}/>
        <View style={{ flex: 8 }}>
            <ReadyImg/>
            <Text style={styles.title}>{TEXTS.TITLE[0]}</Text>
            <Text style={styles.subtitle}>{TEXTS.SUBTITLE[0]}</Text>
            <Text style={styles.subtitle}>{TEXTS.SUBTITLE[1]}</Text>
            <View style={{ height: 20 }} />
            <Button title='시작하기' 
            onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Root' }]
            })} 
            textStyle={{fontWeight: 'bold'}} />
        </View>
        <View style={{ flex: 1 }}/>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},
item: {
  height:40,
  borderBottomWidth: 1,
  borderColor: '#868686',
  backgroundColor: '#ECE9E9',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  color:"#868686"  
},
isButtonActive: {
  backgroundColor: '#5782F1',
},
button: {
  padding: 10,
  marginVertical: 10,
  backgroundColor: '#5782F1',
  borderRadius: 25,
},
buttonText: {
  color: 'white',
  textAlign: 'center',
},
title: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'center',
},
textstyle : {
  fontSize: 13,
  textAlign: 'center',
  color: '#3B3B3B',
},
subtitle: {
  textAlign: 'center',

},
activeTextStyle: {
  color: 'white', // 활성화된 아이템의 텍스트 색상 변경
},
});

export default OnBoarding5;

