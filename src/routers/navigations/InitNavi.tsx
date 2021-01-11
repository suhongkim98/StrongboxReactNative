import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import InitScreen from '../screens/InitScreen';
import SetPinScreen from '../screens/SetPinScreen';
import LoginScreen from '../screens/LoginScreen';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import {createStackNavigator} from '@react-navigation/stack';
import MainNavi from './MainNavi';
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';
import LoadingSVG from '../../images/LoadingSVG';
import EditDrawerScreen from '../screens/EditDrawerScreen';
import EditAccountScreen from '../screens/EditAccountScreen';

const LoadingWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.mainColor};
  justify-content: center;
  align-items: center;
`;

const Stack = createStackNavigator();
const InitNavi = () => {
  const [isExistUser, setIsExistUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 사용자 여부 검사하기
    const database = StrongboxDatabase.getInstance();
    database
      .checkUser()
      .then((result) => {
        setIsExistUser(result);
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  if (isLoading) {
    //로딩 중일 땐
    return (
      <LoadingWrapper>
        <StyledText color="white" size="25px">
          <LoadingSVG width="50px" height="50px" color="white" />
        </StyledText>
      </LoadingWrapper>
    );
  }

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
        <Stack.Screen name="Main" component={MainNavi} />
        <Stack.Screen name="EditDrawerScreen" component={EditDrawerScreen} />
        <Stack.Screen name="EditAccountScreen" component={EditAccountScreen} />
      </Stack.Navigator>
    </>
  );
};

export default InitNavi;
