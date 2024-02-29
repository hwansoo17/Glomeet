import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../AuthScreens/LoginScreen';
import RegisterScreen from '../AuthScreens/RegisterScreen';
import EmailAuthScreen from '../AuthScreens/EmailAuthScreen';
import PasswordResetScreen from '../AuthScreens/PasswordResetScreen';
const Stack = createNativeStackNavigator();



const AuthStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="EmailAuth" component={EmailAuthScreen}/>
      <Stack.Screen name="Register" component={RegisterScreen}/>
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen}/>
    </Stack.Navigator>
  )
};

export default AuthStackScreen;

