import React from 'react';
import styled from 'styled-components/native';
import BottomSlide from './BottomSlide';
import StyledText from './StyledText';

interface BottomSlideProps {
  isVisible: boolean;
  onClose: () => any;
}
const Item = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  justify-content: center;
`;
const BodyWrapper = styled.View`
  width: 100%;
`;
const Divider = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-color: gray;
`;

const DrawerBottomSlide = ({isVisible, onClose}) => {
  return (
    <BottomSlide
      height="150px"
      isVisible={isVisible}
      onClose={onClose}>
      <BodyWrapper>
        <Item>
          <StyledText>폴더 추가</StyledText>
        </Item>
        <Item>
          <StyledText>서비스 추가</StyledText>
        </Item>
        <Divider />
        <Item>
          <StyledText>편집</StyledText>
        </Item>
      </BodyWrapper>
    </BottomSlide>
  );
};

export default DrawerBottomSlide;
