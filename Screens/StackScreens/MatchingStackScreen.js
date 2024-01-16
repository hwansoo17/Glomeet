import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MatchingMainScreen from '../MatchingScreens/MatchingMainScreen';
import MatchingFilterScreen from '../MatchingScreens/MatchingFilterScreen';
const Stack = createNativeStackNavigator();

const MatchingStackScreen = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="MatchingMain" 
            component={MatchingMainScreen}/>
            <Stack.Screen 
            name="MatchingFilter" 
            component={MatchingFilterScreen}/>
        </Stack.Navigator>
    )
    };

export default MatchingStackScreen;