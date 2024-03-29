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
import EditAccountScreen from '../screens/EditAccountScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import SettingScreen from '../screens/SettingScreen';
import SyncRequestScreen from '../screens/SyncRequestScreen';
import SyncResponseScreen from '../screens/SyncResponseScreen';
import SyncRequestPinScreen from '../screens/SyncRequestPinScreen';
import SyncConnectSuccess from '../screens/SyncConnectSuccess';
import SearchServiceScreen from '../screens/SearchServiceScreen';
import EditGroupListScreen from '../screens/EditGroupListScreen';
import EditGroupScreen from '../screens/EditGroupScreen';
import EditServiceScreen from '../screens/EditServiceScreen';
import ChangeAccountScreen from '../screens/ChangeAccountScreen';

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
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isExistUser && (
          <>
            <Stack.Screen name="Init" component={InitScreen} />
            <Stack.Screen name="SetPin" component={SetPinScreen} />
          </>
        )}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainNavi} />
        <Stack.Screen name="EditAccountScreen" component={EditAccountScreen} />
        <Stack.Screen name="AddAccountScreen" component={AddAccountScreen} />
        <Stack.Screen name="AddServiceScreen" component={AddServiceScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen name="SyncRequestScreen" component={SyncRequestScreen}/>
        <Stack.Screen name="SyncResponseScreen" component={SyncResponseScreen}/>
        <Stack.Screen name="SyncRequestPinScreen" component={SyncRequestPinScreen} />
        <Stack.Screen name="SyncConnectSuccess" component={SyncConnectSuccess}/>
        <Stack.Screen name="SearchServiceScreen" component={SearchServiceScreen}/>
        <Stack.Screen name="EditGroupListScreen" component={EditGroupListScreen} />
        <Stack.Screen name="EditGroupScreen" component={EditGroupScreen} />
        <Stack.Screen name="EditServiceScreen" component={EditServiceScreen} />
        <Stack.Screen name="ChangeAccountScreen" component={ChangeAccountScreen} />
      </Stack.Navigator>
    </>
  );
};

export default InitNavi;
