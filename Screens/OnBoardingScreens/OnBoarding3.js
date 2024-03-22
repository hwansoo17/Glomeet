import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from '../../CustomComponent';

const OnBoarding3 = ({ navigation }) => {
  const [userHobby, setUserHobby] = useState('');
  const hobbyData = ['운동', '여행', '게임', '문화', '음식', '언어'];

  const saveHobby = async () => {
    await AsyncStorage.setItem('userHobby', userHobby);
    navigation.navigate('OnBoarding4');
  };
const [isButtonActive, setButtonActive] = useState(null);
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        isButtonActive === item && styles.isButtonActive // 선택된 아이템인 경우 스타일을 적용
      ]}
      onPress={() => {
        setUserHobby(item);
        setButtonActive(item); // 아이템 선택 시 상태 업데이트
      }}>
      <Text style = {[styles.textstyle, isButtonActive === item && styles.activeTextStyle]}>{item}</Text>
    </TouchableOpacity>
  );
const TEXTS = {
  TITLE: ['당신은', '관심사는 무엇인가요?'],
  SUBTITLE: ['Choose one option for now.', 'You can explore others later.'],
  BUTTON_TEXT: '다음으로 넘어가기',
};

 return (
  <View style={styles.container}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 8 }}>
        <View style={{ flex: 1 }}/>
        <View style={{ flex: 8 }}>
          
          <Text style={styles.title}>{TEXTS.TITLE[0]}</Text>
          <Text style={styles.title}>{TEXTS.TITLE[1]}</Text>
          <Text style={styles.subtitle}>{TEXTS.SUBTITLE[0]}</Text>
          <Text style={styles.subtitle}>{TEXTS.SUBTITLE[1]}</Text>
          <View style={{ height: 20 }} />
          <FlatList
            data={hobbyData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}


          />
          <Button title='다음으로 넘어가기' onPress={saveHobby} textStyle={{fontWeight: 'bold'}}/>
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

export default OnBoarding3;
