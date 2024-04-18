import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeMain from '../HomeScreens/HomeMain';
import EditProfile from '../HomeScreens/EditProfile';
const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
    return (
        <Stack.Navigator initialRouteName='HomeMain'>
            <Stack.Screen name="HomeMain" component={HomeMain}/>
            <Stack.Screen name="EditProfile" component={EditProfile}/>
        </Stack.Navigator>
    )
    };

export default HomeStackScreen;