import React ,{useState} from "react";
import {View, Text, TouchableOpacity, FlatList, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api"
import MainButton from '../../customComponents/MainButton';
import SelectableList from "./SelectableList";
import TitleSubtitleComponent from "./TitleSubtitleComponent";
import { useTranslation } from "react-i18next";
const OnBoarding3 = ({navigation}) => {
  const { t } = useTranslation();
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
    const userContinent = await AsyncStorage.getItem('userContinent')
    const userHobby = await AsyncStorage.getItem('userHobby')
    try {
      const response = await authApi.post('/auth/inputAdditionalInfo', {country: userContinent, interest: userHobby, type: selectedItem}) 
      if (response.status == 200) {
        console.log(userContinent, userHobby, selectedItem)
        navigation.navigate('OnBoarding4')
      }; 
    } catch (error) {
        console.log(error);
        // navigation.navigate('OnBoarding4') //주석처리해야됌
    }
  }  

  const title = t("onboarding.title3")
  const subtitle = t("onboarding.subtitle")

  return (
    <SafeAreaView style={{flex:1, backgroundColor: '#fff', flexDirection: 'row'}}>
      <View style={{ flex: 1 }}/>
      <View style={{ flex: 8 }}>
        <View style={{flex:1}}/>
        <View style={{flex:14}}>
          <TitleSubtitleComponent title={title} subtitle={subtitle}/>
          <View style={{flex:2}}/>
          <SelectableList data={data} selectItem={selectItem} selectedItem={selectedItem} renderItemStyle={{height: 56}}/>
          <View style={{flex:2}}/>
        </View>
        <MainButton title={t("onboarding.buttontext")} onPress={savePersonalType} 
            disabled={!isButtonActive} 
        />
        <View style={{flex:1}}/>
      </View>
      <View style={{ flex: 1}}/>
    </SafeAreaView>
  );
};

export default OnBoarding3;