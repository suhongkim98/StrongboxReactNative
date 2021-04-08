import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import StyledText from './StyledText';

const LoadingWrapper = styled.View`
  flex: 1;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  justify-content: center;
  align-items: center;
`;
const LoadingBackground = styled.View`
  flex: 1;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.1;
`;

interface LoadingProps {
    text: string;
}
const Loading = ({text}: LoadingProps) => {
    return (<LoadingWrapper>
    <LoadingBackground />
    <StyledText size="17px" fontWeight="700" color="black">{text}</StyledText><ActivityIndicator color="black"/>
</LoadingWrapper>);
};

export default Loading;