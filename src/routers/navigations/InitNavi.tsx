import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import InitScreen from '../screens/InitScreen';
import SetPinScreen from '../screens/SetPinScreen';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
const InitNavi = () => {
  const [isExistUser, setIsExistUser] = useState(false);
  useEffect(() => {
    // 사용자 여부 검사하기
    const database = StrongboxDatabase.getInstance();
    database
      .checkUser()
      .then((result) => {
        setIsExistUser(result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Stack.Navigator headerMode="none">
        {!isExistUser && (
          <>
            <Stack.Screen name="Init" component={InitScreen} />
            <Stack.Screen name="SetPin" component={SetPinScreen} />
          </>
        )}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </>
  );
};

export default InitNavi;
