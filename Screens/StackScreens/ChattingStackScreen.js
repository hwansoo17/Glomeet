import React, {useLayoutEffect} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChattingMain from '../ChattingScreens/ChattingMain';
import MatchingChatRoom from '../ChattingScreens/MatchingChatRoom';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useContext } from "react";
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
            component={ChattingMain}/>
            <Stack.Screen
            name="MatchingChatRoom"
            component={MatchingChatRoom}/>
        </Stack.Navigator>
    )
    };

export default ChattingStackScreen;