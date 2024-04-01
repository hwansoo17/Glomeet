import React ,{useState} from "react";
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../api"
import MainButton from '../../customComponents/MainButton';
import SelectableList from "./SelectableList";
import TitleSubtitleComponent from "./TitleSubtitleComponent";
const OnBoarding3 = ({navigation}) => {
  const data = ['내향적', '외향적']
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
  const savePersonalType = async() => {
    const email = await AsyncStorage.getItem('email')
    const userContinent = await AsyncStorage.getItem('userContinent')
    const userHobby = await AsyncStorage.getItem('userHobby')
    try {
      const response = await api.post('/auth/inputAdditionalInfo', {email: email, country: userContinent, interest: userHobby, type: selectedItem}) 
      if (response.status == 200) {
        console.log(email, userContinent, userHobby, selectedItem)
        navigation.navigate('OnBoarding4')
      }; 
    } catch (error) {
      if (error.response.status == 409) {
        console.log(error.response.status);
      };
    }
  }  

  const title =  ['당신의','성향은 무엇인가요']
  const subtitle = ['Choose one option for now.', 'You can explore others later.']

  return (
    <View style={{flex:1, backgroundColor: '#fff', flexDirection: 'row'}}>
      <View style={{ flex: 1 }}/>
      <View style={{ flex: 8 }}>
        <View style={{flex:1.5}}/>
        <View style={{flex:16}}>
          <TitleSubtitleComponent titles={title} subtitles={subtitle}/>
          <View style={{flex:2}}/>
          <SelectableList data={data} selectItem={selectItem} selectedItem={selectedItem} renderItemStyle={{height: 56}}/>
          <View style={{flex:2}}/>
          <MainButton title='다음으로 넘어가기' onPress={savePersonalType} 
            disabled={!isButtonActive} 
          />
        </View>
        <View style={{flex:1}}/>
      </View>
      <View style={{ flex: 1}}/>
    </View>
  );
};

export default OnBoarding3;