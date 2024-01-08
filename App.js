import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthStackScreen from './Screens/StackScreens/AuthStackScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Home = () => null
const Profile = () => null
const Settings = () => null


function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  )
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  
  React.useEffect(() => {
    console.log("이펙트시작");
    setTimeout(() => {
      setIsLoggedIn(false);
    }, 2000);
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
        <Stack.Screen 
        name="Root" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}/>
        ):(
        <Stack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{ headerShown: false }}/>)}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;