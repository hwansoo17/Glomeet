import React, {useLayoutEffect} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MatchingChatList from "./MatchingChatList";
import MeetingChatList from "./MeetingChatList";
import SmallLogo from '../../assets/glomeet_logo_top_tab.svg';
const topTab = createMaterialTopTabNavigator();

const ChattingMain = ({navigation}) => {
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
            <topTab.Screen name="매칭" component={MatchingChatList}/>
            <topTab.Screen name="모임" component={MeetingChatList}/>     
        </topTab.Navigator>
    )
    };

export default ChattingMain;
