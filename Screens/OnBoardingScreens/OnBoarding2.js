import React ,{useState} from "react";
import {View, Text, TouchableOpacity, FlatList, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainButton from '../../customComponents/MainButton';
import SelectableList from "./SelectableList";
import TitleSubtitleComponent from "./TitleSubtitleComponent";
import { useTranslation } from "react-i18next";
const OnBoarding2 = ({navigation}) => {
  const { t } = useTranslation();
  const data = ['운동', '여행', '게임', '문화', '음식', '언어']
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
  const saveHobby = async() => {
    await AsyncStorage.setItem('userHobby', selectedItem)
    navigation.navigate('OnBoarding3')
  }   

  const title = t("onboarding.title2")
  const subtitle = t("onboarding.subtitle")

  return (
    <SafeAreaView style={{flex:1, backgroundColor: '#fff', flexDirection: 'row'}}>
      <View style={{ flex: 1 }}/>
      <View style={{ flex: 8 }}>
        <View style={{flex:1}}/>
        <View style={{flex:14}}>
          <TitleSubtitleComponent title={title} subtitle={subtitle}/>
          <View style={{flex:2}}/>
          <SelectableList data={data} selectItem={selectItem} selectedItem={selectedItem}/>
          <View style={{flex:2}}/>
        </View>
        <MainButton title={t("onboarding.buttontext")} onPress={saveHobby} 
            disabled={!isButtonActive} 
        />
        <View style={{flex:1}}/>
      </View>
      <View style={{ flex: 1}}/>
    </SafeAreaView>
  );
};

export default OnBoarding2;
