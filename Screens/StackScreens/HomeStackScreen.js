import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeMainScreen from '../HomeScreens/HomeMainScreen';

const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
    return (
        <Stack.Navigator initialRouteName='HomeMain'>
        <Stack.Screen 
        name="HomeMain" 
        component={HomeMainScreen}/>
        </Stack.Navigator>
    )
    };

export default HomeStackScreen;