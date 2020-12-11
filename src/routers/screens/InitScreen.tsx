import React, { Component } from 'react'
import { Text, View,Button, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native';
import SQLite from 'react-native-sqlite-storage';
import {StrongboxDatabase} from '../../StrongboxDatabase';

const TotalWrapper = styled.View`
flex:1;
background-color:navy;
`;
const TestStyledTouchableOpacity = styled.TouchableOpacity`
flex: 1;
align-items: center;
justify-content: center;
`;
const TestStyledText = styled.Text`
color:white;
`;
const InitScreen = ({ navigation }) =>{
  
  const testCrypto = () =>{
    const database = StrongboxDatabase.getInstance();
    alert(database.testCrypto());
  }
  const testConnectDB = () =>{
    const database = StrongboxDatabase.getInstance();
    database.testConnectDB();
  }

    return <TotalWrapper>
    <TestStyledTouchableOpacity onPress={() => testConnectDB()}>
      <TestStyledText>connect db test btn</TestStyledText>
    </TestStyledTouchableOpacity>
    <TestStyledTouchableOpacity onPress={() => testCrypto()}>
      <TestStyledText>open crypto test</TestStyledText>
    </TestStyledTouchableOpacity>
    </TotalWrapper>
}

export default InitScreen;