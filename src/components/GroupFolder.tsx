import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import PlusSVG from '../images/PlusSVG';
import MinusSVG from '../images/MinusSVG';
import StyledText from './StyledText';
import {TouchableOpacity} from 'react-native';

interface GroupFolderProps {
  groupName: string;
  children?: any;
}
const TotalWrapper = styled.View`
  width: 100%;
  flex-direction: column;
`;
const HeaderWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
interface BodyProps {
  height: string;
  isClose: boolean;
}
const BodyWrapper = styled.View<BodyProps>`
  padding-left: 15px;
  overflow: hidden;
  height: ${(props) => props.height + 'px'};
`;
const BodyInnerWrapper = styled.View`
  overflow: visible;
`;

const GroupFolder = ({groupName, children}: GroupFolderProps) => {
  const [isClose, setClose] = useState(false);
  const [innerBodyHeight, setInnerBodyHeight] = useState(0);

  useEffect(() => {
    if (isClose) {
      setInnerBodyHeight(0);
    } else {
      setInnerBodyHeight(27 * children.length);
    }
  }, [isClose, children.length]);

  const toggleFolder = () => {
    setClose(!isClose);
  };

  return (
    <TotalWrapper>
      <TouchableOpacity onPress={() => toggleFolder()}>
        <HeaderWrapper>
          <StyledText size="20px" color="gray">
            {groupName}
          </StyledText>
          {isClose ? (
            <PlusSVG width="20px" height="20px" color="gray" />
          ) : (
            <MinusSVG width="20px" height="20px" color="gray" />
          )}
        </HeaderWrapper>
      </TouchableOpacity>
      <BodyWrapper height={innerBodyHeight} isClose={isClose}>
        <BodyInnerWrapper>{children}</BodyInnerWrapper>
      </BodyWrapper>
    </TotalWrapper>
  );
};

export default GroupFolder;
