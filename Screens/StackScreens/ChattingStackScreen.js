import React, {useLayoutEffect} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChattingMainScreen from '../ChattingScreens/ChattingMainScreen';
import ChattingDetailScreen from '../ChattingScreens/ChattingDetailScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

const ChattingStackScreen = ({navigation, route}) => {
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "ChattingMain" ||  routeName === undefined) {
        navigation.setOptions({ tabBarStyle : {display: 'flex' }});
        } else {
            navigation.setOptions({ tabBarStyle : {display: 'none' }});
        }
    }, [navigation, route]);
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="ChattingMain" 
            component={ChattingMainScreen}/>
            <Stack.Screen
            name="ChattingDetail"
            component={ChattingDetailScreen}/>
        </Stack.Navigator>
    )
    };

export default ChattingStackScreen;