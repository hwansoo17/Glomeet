import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MatchingChatListScreen from "./MatchingChatListScreen";
import MeetingChatListScreen from "./MeetingChatListScreen";

const topTab = createMaterialTopTabNavigator();

const ChattingMainScreen = ({navigation}) => {
    
    return (
        <topTab.Navigator>
            <topTab.Screen name="매칭" component={MatchingChatListScreen}/>
            <topTab.Screen name="모임" component={MeetingChatListScreen}/>     
        </topTab.Navigator>
    )
    };

export default ChattingMainScreen;
