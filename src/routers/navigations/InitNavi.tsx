import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import InitScreen from '../screens/InitScreen';
import SetPinScreen from '../screens/SetPinScreen';
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
    </Stack.Navigator>
      </>
}

export default InitNavi;