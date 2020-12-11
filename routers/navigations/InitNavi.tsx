import 'react-native-gesture-handler';
import React, { Component } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import InitScreen from '../screens/InitScreen';
import {
  createStackNavigator,
} from '@react-navigation/stack';

const Stack = createStackNavigator();
const InitNavi = () => {
    return <Stack.Navigator>
        <Stack.Screen
          name="Init"
          component={InitScreen}
          options={{ title: 'InitScreen 타이틀' }}
        />
      </Stack.Navigator>
}

export default InitNavi;