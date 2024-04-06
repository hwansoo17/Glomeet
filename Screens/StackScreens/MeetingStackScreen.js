import React, {useLayoutEffect} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MeetingMain from '../MeetingScreens/MeetingMain';
import MeetingDetail from '../MeetingScreens/MeetingDetail';
import MeetingCreate from '../MeetingScreens/MeetingCreate';
import SmallLogo from '../../assets/glomeet_logo_top_tab.svg';
import BackIcon from '../../assets/backIcon.svg';
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
        <Stack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                headerTitle: () => (
                    <SmallLogo/>
                ),
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen 
            name="MeetingMain" 
            component={MeetingMain}/>
            <Stack.Screen 
            name="MeetingDetail" 
            component={MeetingDetail}/>
            <Stack.Screen 
            name="MeetingCreate"
            component={MeetingCreate}/>
        </Stack.Navigator>
    )
    };

export default MeetingStackScreen;