import React, { Component } from 'react'
import { Text, StyleSheet, View,Button } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';

const Home = ({ navigation }) =>{
  return <View style={styles.HomeView}>
    <Text> 홈 화면 입니다.</Text>        
    <Button
          title="테스트 화면으로 가기"
          onPress={() => navigation.navigate('Test2')}
        />
  </View>
}
const Test2 = () =>{
  return <View style={styles.HomeView}>
    <Text> test 입니다.</Text>
  </View>
}

const RouteContainer = createStackNavigator (
  {
    Home: {
      screen: Home,
    },
    Test2:{
      screen: Test2,
    },
  },
  {
    initialRouteName: 'Home' // 처음 보여 줄 화면을 설정합니다.
  },
);

const AppContainer = createAppContainer(RouteContainer);
const store = createStore(rootReducer);
const App = () =>{
  return <>
  <Provider store={store}>
  <AppContainer/>
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