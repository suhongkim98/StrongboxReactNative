import React from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import styled from 'styled-components/native';
import {Text, Button} from 'react-native';
import theme from '../../styles/theme';
//navigation.reset({routes: [{name: 'SetPin'}]});

const TotalWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.backgroundMainColor};
`;
const DrawerScreen = (props) => {
  return (
    <TotalWrapper>
      <Text>아아</Text>
      <Text>아아</Text>
      <Button
        title="계정1"
        onPress={() => props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 1})} //기존화면으로 파라미터에 IDX를 넣고 이동
      />
      <Button
        title="계정2"
        onPress={() => props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 2})}
      />
      <DrawerContentScrollView {...props}>
        <Text>asssd</Text>
        <Text>asssd</Text>
        <DrawerItem label="Help" />
      </DrawerContentScrollView>
    </TotalWrapper>
  );
};

export default DrawerScreen;
