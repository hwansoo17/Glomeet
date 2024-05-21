import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeMain from '../HomeScreens/HomeMain';
import EditProfile from '../HomeScreens/EditProfile';
import ChallengeList from '../HomeScreens/ChallengeList';
import Unregister from '../HomeScreens/Unregister';
import SmallLogo from '../../assets/glomeet_logo_top_tab.svg';
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
    const { t } = useTranslation()
    return (
        <Stack.Navigator initialRouteName='HomeMain'
            screenOptions={{
                headerBackImageSource: require('../../assets/backIcon.png'),
                headerBackTitleVisible: false,
                headerTitle: () => (
                    <SmallLogo/>
                ),
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="HomeMain" component={HomeMain}/>
            <Stack.Screen name="EditProfile" component={EditProfile}/>
            <Stack.Screen name="Unregister" component={Unregister} options={{headerTitle: t("homemain.mypage.unregister"), headerTitleStyle: {fontFamily: "Pretendard-SemiBold"}}}/>
            <Stack.Screen name="ChallengeList" component={ChallengeList}/>
        </Stack.Navigator>
    )
    };

export default HomeStackScreen;