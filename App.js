import 'react-native-gesture-handler';
import React, { Component } from 'react'
import { Text, StyleSheet, View,Button, TouchableOpacity } from 'react-native'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import {NavigationContainer} from '@react-navigation/native';
///
import SQLite from 'react-native-sqlite-storage';
let db;
///
import styled from 'styled-components/native';
//
import {
  createStackNavigator,
} from '@react-navigation/stack';

const TestStyledTouchableOpacity = styled.TouchableOpacity`
flex: 1;
align-items: center;
justify-content: center;
`;
const HomeScreen = ({ navigation }) => {
  const testConnectDB = () =>{
    SQLite.openDatabase({
      name:'test.db', // assets/www 안에 있음
      createFromLocation:1,
    },
    successToOpenDB,
    failToOpenDB,
    );
  }
  const successToOpenDB = () =>{
    alert("success");
  }
  const failToOpenDB = (err) =>{
    console.log(err);
  }
  return (
    <>
    <TestStyledTouchableOpacity onPress={() => testConnectDB()}>
      <Text>open db test btn</Text>
    </TestStyledTouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Details')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Detail Screen</Text>
    </TouchableOpacity>
    </>
  );
}

const DetailsScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Detail Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

const store = createStore(rootReducer);
const App = () =>{
  return <>
  <Provider store={store}>
  <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈화면 타이틀!!' }}
          initialParams={{ itemId: 42 }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
  </NavigationContainer>
  </Provider>
  </>
}


export default App;

const styles = StyleSheet.create({
  Main:{
    flex:1
  },
  HomeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})