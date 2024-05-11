import React from "react";
import {View, Text, TouchableOpacity, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import ChallengeList from "../HomeScreens/ChallengeList";
import EventEmitter from "react-native-eventemitter";
const MatchingFilterScreen = ({navigation}) => {
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
        <View>
            <Text>MatchingFilterScreen</Text>
            <TouchableOpacity
                onPress={matching}
            >
                <Text>매칭시작</Text>
            </TouchableOpacity>
        </View>
    )
    };

export default MatchingFilterScreen;
