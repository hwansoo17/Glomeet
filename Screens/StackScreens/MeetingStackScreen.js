import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MeetingMainScreen from '../MeetingScreens/MeetingMainScreen';

const Stack = createNativeStackNavigator();

const MeetingStackScreen = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="MeetingMain" 
            component={MeetingMainScreen}/>
        </Stack.Navigator>
    )
    };

export default MeetingStackScreen;