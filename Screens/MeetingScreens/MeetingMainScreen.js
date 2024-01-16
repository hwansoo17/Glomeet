import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MeetingMainScreen = ({navigation}) => {
    
    return (
        <View>
            <Text>MeetingMainScreen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MatchingFilter')}>
                <Text></Text>
            </TouchableOpacity>
        </View>
    )
    };

export default MeetingMainScreen;
