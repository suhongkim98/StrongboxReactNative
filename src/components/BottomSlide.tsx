import React from 'react';
import styled from 'styled-components';

interface BottomSlideProps {
  children: any;
  height: string;
  isVisible: boolean;
  onClose: () => any;
}
interface TotalWrapperProps {
  height: string;
}
const TotalWrapper = styled.View<TotalWrapperProps>`
  height: ${(props) => props.height};
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: white;
  z-index: 2;
`;
const HeaderWrapper = styled.View`
  width: 100%;
  height: 30px;
  border-bottom-width: 1px;
  border-color: gray;
`;
const BodyWrapper = styled.View`
  padding: 0 20px 0 20px;
  width: 100%;
`;

const CloseButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const Arrow = styled.View`
  width: 10px;
  height: 10px;
  border-top-width: 1px;
  border-right-width: 1px;
  transform: rotate(135deg); /* 각도 */
`;

const BottomSlide = ({children, height, isVisible, onClose}: BottomSlide) => {
  if (!isVisible) {
    return null;
  }
  return (
    <TotalWrapper height={height}>
      <HeaderWrapper>
        <CloseButton
          onPress={() => {
            onClose();
          }}>
          <Arrow />
        </CloseButton>
      </HeaderWrapper>
      <BodyWrapper>{children}</BodyWrapper>
    </TotalWrapper>
  );
};

export default BottomSlide;
