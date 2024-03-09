import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoarding1 from '../OnBoardingScreens/OnBoarding1';
import OnBoarding2 from '../OnBoardingScreens/OnBoarding2';
import OnBoarding3 from '../OnBoardingScreens/OnBoarding3';
import OnBoarding4 from '../OnBoardingScreens/OnBoarding4';
import OnBoarding5 from '../OnBoardingScreens/OnBoarding5';
const Stack = createNativeStackNavigator();



const OnBoardingStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName='OnBoarding1'>
      <Stack.Screen name="OnBoarding1" component={OnBoarding1} options={{ headerShown: false }}/>
      <Stack.Screen name="OnBoarding2" component={OnBoarding2} options={{ headerShown: false }}/>
      <Stack.Screen name="OnBoarding3" component={OnBoarding3} options={{ headerShown: false }}/>
      <Stack.Screen name="OnBoarding4" component={OnBoarding4} options={{ headerShown: false }}/>
      <Stack.Screen name="OnBoarding5" component={OnBoarding5} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
};

export default OnBoardingStackScreen;