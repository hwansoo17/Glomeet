import React, { useState } from "react";
import {View, Text, TouchableOpacity, Alert, SafeAreaView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import ChallengeList from "../HomeScreens/ChallengeList";
import EventEmitter from "react-native-eventemitter";
import MainButton from "../../customComponents/MainButton";
import SelectableList from "../OnBoardingScreens/SelectableList";
import TitleSubtitleComponent from "../OnBoardingScreens/TitleSubtitleComponent";
import { useTranslation } from "react-i18next";
const MatchingFilterScreen = ({navigation}) => {
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
    const title = t("matching.partnerPersonality")
    const subtitle = t("matching.notice")
    const matching = async() => {
        try {
            const response = await authApi.get("/matching/start")
            if (response.status == 200) {
                console.log(response.data, ': 매칭시작');
                navigation.navigate('MatchingMain')
                EventEmitter.emit("matchingInProgress", "matchingInProgress")
            }
        } catch (error) {
            // if (error.response.status == 400) {
            //     Alert.alert("이미 매칭이 진행중이에요.")
            // }    
            console.log(error.response);
        }
    }
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
                <MainButton title={t("matching.matchingStart")} onPress={matching} 
                    disabled={!isButtonActive} 
                />
                <View style={{flex:1}}/>
            </View>
            <View style={{ flex: 1}}/>
        </SafeAreaView>
    )
    };

export default MatchingFilterScreen;
