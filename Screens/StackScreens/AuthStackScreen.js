import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../AuthScreens/LoginScreen';
import RegisterScreen from '../AuthScreens/RegisterScreen';
import EmailAuthScreen from '../AuthScreens/EmailAuthScreen';
const Stack = createNativeStackNavigator();



const AuthStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="EmailAuth" component={EmailAuthScreen}/>
      <Stack.Screen name="Register" component={RegisterScreen}/>
    </Stack.Navigator>
  )
};

export default AuthStackScreen;

