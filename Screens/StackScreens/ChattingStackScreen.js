import React, {useLayoutEffect} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChattingMain from '../ChattingScreens/ChattingMain';
import MatchingChatRoom from '../ChattingScreens/MatchingChatRoom';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MeetingChatRoom from '../ChattingScreens/MeetingChatRoom';
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
        <Stack.Navigator
            screenOptions={{
                headerBackImageSource: require('../../assets/backIcon.png'),
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen 
            name="ChattingMain" 
            component={ChattingMain}/>
            <Stack.Screen
            name="MatchingChatRoom"
            component={MatchingChatRoom}/>
            <Stack.Screen
            name="MeetingChatRoom"
            component={MeetingChatRoom}/>
        </Stack.Navigator>
    )
    };

export default ChattingStackScreen;