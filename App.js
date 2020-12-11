import 'react-native-gesture-handler';
import React, { Component } from 'react'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import {NavigationContainer} from '@react-navigation/native';
import InitNavi from './routers/navigations/InitNavi';

const store = createStore(rootReducer);
const App = () =>{
  return <>
  <Provider store={store}>
  <NavigationContainer>
    <InitNavi/>
  </NavigationContainer>
  </Provider>
  </>
}


export default App;