import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import ChallengeList from "../HomeScreens/ChallengeList";
const MatchingFilterScreen = ({navigation}) => {
    const matching = async() => {
        try {
            const response = await authApi.get("/matching/start")
            if (response.status == 200) {
                console.log(response.data, ': 매칭시작');
            }
        } catch (error) {
            console.log(error);
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
