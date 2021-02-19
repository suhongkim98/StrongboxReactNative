import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

interface TotalWrapperProps {
  onPressItem: () => any;
  title: string;
}
const TotalWrapper = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  justify-content: center;
  border-bottom-width: 1px;
  border-color: gray;
`;
const DropdownItem = ({onPressItem, title}: TotalWrapperProps) => {
  return (
    <TotalWrapper
      onPress={() => {
        onPressItem();
      }}>
      <StyledText>{title}</StyledText>
    </TotalWrapper>
  );
};

export default DropdownItem;
