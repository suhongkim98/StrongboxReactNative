import React from 'react';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import {Button} from 'react-native';

const TotalWrapper = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const MainScreen = ({route, navigation}) => {
  return (
    <TotalWrapper>
      <Button
        title="메뉴열기"
        onPress={() => {
          navigation.toggleDrawer();
        }}
      />
      <StyledText color="black">
        메인 {route.params && route.params.SERVICE_IDX}
      </StyledText>
    </TotalWrapper>
  );
};

export default MainScreen;
