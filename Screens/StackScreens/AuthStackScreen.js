import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../AuthScreens/Login';
import Register1 from '../AuthScreens/Register1';
import Register2 from '../AuthScreens/Register2';
import PasswordReset1 from '../AuthScreens/PasswordReset1';
import PasswordReset2 from '../AuthScreens/PasswordReset2';
const Stack = createNativeStackNavigator();



const AuthStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Register1" component={Register1}/>
      <Stack.Screen name="Register2" component={Register2}/>
      <Stack.Screen name="PasswordReset1" component={PasswordReset1}/>
      <Stack.Screen name="PasswordReset2" component={PasswordReset2}/>
    </Stack.Navigator>
  )
};

export default AuthStackScreen;

