import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MatchingMainScreen = ({navigation}) => {
    
    return (
        <View>
            <Text>MatchingMainScreen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MatchingFilter')}>
                <Text>매칭하러 가기</Text>
            </TouchableOpacity>
        </View>
    )
    };

export default MatchingMainScreen;
