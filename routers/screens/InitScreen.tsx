import React, { Component } from 'react'
import { Text, View,Button, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native';
import SQLite from 'react-native-sqlite-storage';

const TotalWrapper = styled.View`
flex:1;
background-color:navy;
`;
const TestStyledTouchableOpacity = styled.TouchableOpacity`
flex: 1;
align-items: center;
justify-content: center;
`;
const InitScreen = ({ navigation }) =>{

    const testConnectDB = () =>{
    let db = SQLite.openDatabase({
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

    return <TotalWrapper>
    <TestStyledTouchableOpacity onPress={() => testConnectDB()}>
      <Text>open db test btn</Text>
    </TestStyledTouchableOpacity>
    </TotalWrapper>
}

export default InitScreen;