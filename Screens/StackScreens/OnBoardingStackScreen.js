import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoarding1 from '../OnBoardingScreens/OnBoarding1';
import OnBoarding2 from '../OnBoardingScreens/OnBoarding2';
import OnBoarding3 from '../OnBoardingScreens/OnBoarding3';
import OnBoarding4 from '../OnBoardingScreens/OnBoarding4';
import SmallLogo from '../../assets/glomeet_logo_top_tab.svg';
const Stack = createNativeStackNavigator();



const OnBoardingStackScreen = () => {
  return (
    <Stack.Navigator 
      initialRouteName='OnBoarding1'
      screenOptions={{
        headerBackImageSource: require('../../assets/backIcon.png'),
        headerBackTitleVisible: false,
        headerTitle: () => (
          <SmallLogo/>
      ),
        headerTitleAlign: 'center',
    }}  
    >
      <Stack.Screen name="OnBoarding1" component={OnBoarding1} options={{ headerShown: true }}/>
      <Stack.Screen name="OnBoarding2" component={OnBoarding2} options={{ headerShown: true }}/>
      <Stack.Screen name="OnBoarding3" component={OnBoarding3} options={{ headerShown: true }}/>
      <Stack.Screen name="OnBoarding4" component={OnBoarding4} options={{ headerShown: true }}/>
    </Stack.Navigator>
  )
};

export default OnBoardingStackScreen;