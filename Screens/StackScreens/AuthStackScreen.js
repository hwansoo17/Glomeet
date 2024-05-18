import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../AuthScreens/Login';
import Register1 from '../AuthScreens/Register1';
import Register2 from '../AuthScreens/Register2';
import PasswordReset1 from '../AuthScreens/PasswordReset1';
import PasswordReset2 from '../AuthScreens/PasswordReset2';
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();




const AuthStackScreen = () => {
  const { t } = useTranslation()
  return (
    <Stack.Navigator 
      screenOptions={{
        headerBackImageSource: require('../../assets/backIcon.png'),
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
      initialRouteName='Login'>
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{ headerShown: false }}/>
      <Stack.Screen name="Register1" component={Register1} options={{headerTitle: t("login.signup"), headerTitleStyle: {fontFamily: "Pretendard-SemiBold"}}}/>
      <Stack.Screen name="Register2" component={Register2} options={{headerTitle: t("login.signup"), headerTitleStyle: {fontFamily: "Pretendard-SemiBold"}}}/>
      <Stack.Screen name="PasswordReset1" component={PasswordReset1} options={{headerTitle: t("login.passwordreset"), headerTitleStyle: {fontFamily: "Pretendard-SemiBold"}}}/>
      <Stack.Screen name="PasswordReset2" component={PasswordReset2} options={{headerTitle: t("login.passwordreset"), headerTitleStyle: {fontFamily: "Pretendard-SemiBold"}}}/>
    </Stack.Navigator>
  )
};

export default AuthStackScreen;

