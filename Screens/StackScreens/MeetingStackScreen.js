import React, {useLayoutEffect} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MeetingMainScreen from '../MeetingScreens/MeetingMainScreen';
import MeetingDetailScreen from '../MeetingScreens/MeetingDetailScreen';
const Stack = createNativeStackNavigator();


const MeetingStackScreen = ({navigation, route}) => {
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "MeetingMain" ||  routeName === undefined) {
        navigation.setOptions({ tabBarStyle : {display: 'flex' }});
        } else {
            navigation.setOptions({ tabBarStyle : {display: 'none' }});
        }
    }, [navigation, route]);
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="MeetingMain" 
            component={MeetingMainScreen}/>
            <Stack.Screen 
            name="MeetingDetail" 
            component={MeetingDetailScreen}/>
        </Stack.Navigator>
    )
    };

export default MeetingStackScreen;