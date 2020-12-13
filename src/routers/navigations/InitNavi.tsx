import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import InitScreen from '../screens/InitScreen';
import SetPinScreen from '../screens/SetPinScreen';
import MainScreen from '../screens/MainScreen';
import {
  createStackNavigator,
} from '@react-navigation/stack';

const Stack = createStackNavigator();
const InitNavi = () => {
    return <>
    <Stack.Navigator
      initialRouteName="Init"
      headerMode="none"
    >
      <Stack.Screen
        name="Init"
        component={InitScreen}
      />
      <Stack.Screen
        name="SetPin"
        component={SetPinScreen}
      />
      <Stack.Screen
        name="Main"
        component={MainScreen}
      />
    </Stack.Navigator>
      </>
}

export default InitNavi;