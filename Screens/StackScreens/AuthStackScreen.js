import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../LoginScreens/LoginScreen';
import AuthenticationScreen from '../LoginScreens/AuthenticationScreen';
import PasswordRegisterScreen from '../LoginScreens/PasswordRegisterScreen';
import EmailAuthScreen from '../LoginScreens/EmailAuthScreen';
const Stack = createNativeStackNavigator();



const AuthStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="EmailAuth" component={EmailAuthScreen}/>
      <Stack.Screen name="Authentication" component={AuthenticationScreen}/>
      <Stack.Screen name="PasswordRegister" component={PasswordRegisterScreen}/>
    </Stack.Navigator>
  )
};

export default AuthStackScreen;

