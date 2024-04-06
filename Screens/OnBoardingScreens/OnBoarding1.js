import React, { useState }from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainButton from '../../customComponents/MainButton';
import SelectableList from "./SelectableList";
import TitleSubtitleComponent from "./TitleSubtitleComponent";
const OnBoarding1 = ({ navigation }) => {
  const data = ['아시아', '유럽', '북아메리카', '남아메리카', '오세아니아', '아프리카'];
  const [selectedItem, setSelectedItem] = useState('');
  const [isButtonActive, setButtonActive] = useState(false);
  const selectItem = (item) => {
    if (selectedItem === item) {
      setSelectedItem(''); 
      setButtonActive(false);
    } else {
      setSelectedItem(item); 
      setButtonActive(true); 
    }
  } 
  const saveContinent = async () => {
    await AsyncStorage.setItem('userContinent', selectedItem);
    navigation.navigate('OnBoarding2');
  };

  const title =  ['당신은','어느 대륙 사람인가요']
  const subtitle = ['Choose one option for now.', 'You can explore others later.']
  
  return (
    <View style={{flex:1, backgroundColor: '#fff', flexDirection: 'row'}}>
      <View style={{ flex: 1 }}/>
      <View style={{ flex: 8 }}>
        <View style={{flex:1}}/>
        <View style={{flex:14}}>
          <TitleSubtitleComponent titles={title} subtitles={subtitle}/>
          <View style={{flex:2}}/>
          <SelectableList data={data} selectItem={selectItem} selectedItem={selectedItem}/>
          <View style={{flex:2}}/>
        </View>
        <MainButton title='다음으로 넘어가기' onPress={saveContinent} 
            disabled={!isButtonActive} 
        />
        <View style={{flex:1}}/>
      </View>
      <View style={{ flex: 1}}/>
    </View>
  );
};

export default OnBoarding1;

