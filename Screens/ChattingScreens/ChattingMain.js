import React, {useLayoutEffect} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MatchingChatList from "./MatchingChatList";
import MeetingChatList from "./MeetingChatList";
import SmallLogo from '../../assets/glomeet_logo_top_tab.svg';
import { useTranslation } from "react-i18next";
const topTab = createMaterialTopTabNavigator();


const ChattingMain = ({navigation}) => {
    const { t } = useTranslation()
    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitleAlign: "center",
          headerTitle: () => (
            <SmallLogo/>
        ),
        });
      }, [navigation]);
    return (
        <topTab.Navigator
        screenOptions={{
            tabBarLabelStyle: { fontSize: 16, fontFamily: 'Pretendard-SemiBold' }}}
        >
            <topTab.Screen name="매칭" component={MatchingChatList} options={{ tabBarLabel: t("nav.matching")}}/>
            <topTab.Screen name="모임" component={MeetingChatList} options={{ tabBarLabel: t("nav.meeting")}}/>     
        </topTab.Navigator>
    )
    };

export default ChattingMain;
