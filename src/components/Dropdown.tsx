import React from 'react';
import styled from 'styled-components';
import StyledText from './StyledText';

interface DropdownProps {
  width: string;
  list: any;
  selectedName: string;
  visibleFunc: (visible: boolean) => any;
  visible: boolean;
}
interface TotalWrapperProps {
  width: string;
}
const TotalWrapper = styled.View<TotalWrapperProps>`
  width: ${(props) => props.width};
`;
const Clickable = styled.TouchableOpacity`
  width: 100%;
  height: 30px;
  border-width: 1px;
  border-color: gray;
  border-radius: 3px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 10px;
`;
interface DropdownViewProps {
  height: string;
}
const DropdownView = styled.View<DropdownViewProps>`
  position: absolute;
  top: 35px;
  width: 100%;
  height: ${(props) => props.height};
  background-color: white;
  z-index: 2;
  border-width: 1px;
  border-color: gray;
  border-radius: 3px;
  padding: 0 10px 0 10px;
  align-items: center;
`;
const DropdownScrollView = styled.ScrollView`
  width: 100%;
`;
const Arrow = styled.View`
  width: 10px;
  height: 10px;
  border-top-width: 1px;
  border-right-width: 1px;
  transform: rotate(135deg); /* 각도 */
  border-color: gray;
`;

const Dropdown = ({
  width,
  list,
  selectedName,
  visibleFunc,
  visible,
}: DropdownProps) => {
  const printDropdownItem = () => {
    if (!visible) {
      return null;
    }
    if (list.length <= 0) {
      return null;
    }
    return (
      <DropdownView height="120px">
        <DropdownScrollView>{list}</DropdownScrollView>
      </DropdownView>
    );
  };
  return (
    <TotalWrapper width={width}>
      <Clickable
        onPress={() => {
          visibleFunc(!visible);
        }}>
        {selectedName !== '' ? (
          <StyledText color="black">{selectedName}</StyledText>
        ) : (
          <StyledText color="gray">선택</StyledText>
        )}
        <Arrow />
      </Clickable>
      {printDropdownItem()}
    </TotalWrapper>
  );
};

export default Dropdown;
