import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChattingMainScreen from '../ChattingScreens/ChattingMainScreen';

const Stack = createNativeStackNavigator();

const ChattingStackScreen = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="ChattingMain" 
            component={ChattingMainScreen}/>
        </Stack.Navigator>
    )
    };

export default ChattingStackScreen;