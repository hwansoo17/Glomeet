import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeMain from '../HomeScreens/HomeMain';
import EditProfile from '../HomeScreens/EditProfile';
import ChallengeList from '../HomeScreens/ChallengeList';
import SmallLogo from '../../assets/glomeet_logo_top_tab.svg';
const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
    return (
        <Stack.Navigator initialRouteName='HomeMain'
            screenOptions={{
                // headerBackImage: () => (
                // ),
                headerBackTitleVisible: false,
                headerTitle: () => (
                    <SmallLogo/>
                ),
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="HomeMain" component={HomeMain}/>
            <Stack.Screen name="EditProfile" component={EditProfile}/>
            <Stack.Screen name="ChallengeList" component={ChallengeList}/>
        </Stack.Navigator>
    )
    };

export default HomeStackScreen;