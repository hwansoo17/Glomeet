import React, {useLayoutEffect} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MatchingMainScreen from '../MatchingScreens/MatchingMainScreen';
import MatchingFilterScreen from '../MatchingScreens/MatchingFilterScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import SmallLogo from '../../assets/glomeet_logo_top_tab.svg';
import BackIcon from '../../assets/backIcon.svg';
// import { Image } from "react-native-svg";
const Stack = createNativeStackNavigator();

const MatchingStackScreen = ({navigation, route}) => {
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "MatchingMain" ||  routeName === undefined) {
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
                headerTitle: () => (
                    <SmallLogo/>
                ),
                headerTitleAlign: 'center',
            }}
        >
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