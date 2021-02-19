import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import StyledText from './StyledText';

const TotalWrapper = styled.View`
    flex: 1;
    background-color: ${theme.colors.backgroundMainColor};
`;
const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  height: 60px;
  border-bottom-width: 1px;
`;
const HeaderItemButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 20px 0 20px;
  height: 100%;
`;
const BodyWrapper = styled.View`
  padding: 0 20px 0 20px;
  flex: 1;
`;
const StyledIcon = styled(Icon)`
  font-size: 20px;
  height: 22px;
  color: black;
`;

interface StackScreenProps {
    screenName: string;
    onPressBackButton: () => any;
    children?: any;
  }
const StackScreenContainer = ({onPressBackButton, screenName, children}: StackScreenProps) => {

    return (<TotalWrapper>
        <HeaderWrapper>
          <HeaderItemButton onPress={onPressBackButton}>
            <StyledIcon name="arrowleft" />
          </HeaderItemButton>
          <StyledText fontWeight="700" size="16px">
            {screenName}
          </StyledText>
        <HeaderItemButton>
          <StyledText color="darkred" fontWeight="700" size="16px" />
        </HeaderItemButton>
      </HeaderWrapper>
      <BodyWrapper>{children}</BodyWrapper>
    </TotalWrapper>);
}

export default StackScreenContainer;
