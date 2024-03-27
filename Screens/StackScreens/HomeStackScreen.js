import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeMainScreen from '../HomeScreens/HomeMainScreen';

const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
    return (
        <Stack.Navigator initialRouteName='HomeMain'
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false, // 구분선 제거
            }}
        >
        <Stack.Screen 
        name="HomeMain" 
        component={HomeMainScreen}
        options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#5782F1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },

          }}
        />
        </Stack.Navigator>
    )
    };

export default HomeStackScreen;