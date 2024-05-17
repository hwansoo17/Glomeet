import React from "react";
import {View, Text, TouchableOpacity, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainButton from '../../customComponents/MainButton';
import { useTranslation } from "react-i18next";
import Celebration from "../../assets/celebration.svg"
import TitleSubtitleComponent from "./TitleSubtitleComponent";
const OnBoarding4 = ({navigation}) => {
  const { t } = useTranslation();

  
  return (
    <SafeAreaView style={{flex:1, backgroundColor: '#fff', flexDirection: 'row'}}>
      <View style={{ flex: 1 }}/>
      <View style={{ flex: 8}}>
        <View style={{flex:1}}/>
        <View style={{alignItems:'center', flex:14}}> 
          <Celebration/>
          <TitleSubtitleComponent title={t("onboarding.title4")} subtitle={t("onboarding.subtitle2")}/>
        </View>
      <MainButton
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Root' }]
        })}
        title={t("onboarding.start")}
        />
        <View style={{flex:1}}/>
      </View>
      <View style={{ flex: 1 }}/>
    </SafeAreaView>

  )
};
export default OnBoarding4;