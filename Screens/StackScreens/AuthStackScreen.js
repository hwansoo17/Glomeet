import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../LoginScreens/LoginScreen';
import RegisterScreen from '../LoginScreens/RegisterScreen';
import AuthenticationScreen from '../LoginScreens/AuthenticationScreen';
import PasswordRegisterScreen from '../LoginScreens/PasswordRegisterScreen';

const Stack = createNativeStackNavigator();



const AuthStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Register" component={RegisterScreen}/>
      <Stack.Screen name="Authentication" component={AuthenticationScreen}/>
      <Stack.Screen name="PasswordRegister" component={PasswordRegisterScreen}/>
    </Stack.Navigator>
  )
};

export default AuthStackScreen;

