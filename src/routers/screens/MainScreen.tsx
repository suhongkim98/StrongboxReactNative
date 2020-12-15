import React from 'react';
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';

const TotalWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.backgroundMainColor};
`;

const MainScreen = () => {
  return (
    <TotalWrapper>
      <StyledText color="white">메인</StyledText>
    </TotalWrapper>
  );
};

export default MainScreen;
