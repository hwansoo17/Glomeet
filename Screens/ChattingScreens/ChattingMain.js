import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MatchingChatList from "./MatchingChatList";
import MeetingChatList from "./MeetingChatList";

const topTab = createMaterialTopTabNavigator();

const ChattingMain = ({navigation}) => {
    
    return (
        <topTab.Navigator>
            <topTab.Screen name="매칭" component={MatchingChatList}/>
            <topTab.Screen name="모임" component={MeetingChatList}/>     
        </topTab.Navigator>
    )
    };

export default ChattingMain;
