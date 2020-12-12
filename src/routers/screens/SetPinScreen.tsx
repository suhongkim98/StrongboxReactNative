import React from 'react';
import { View} from 'react-native';
import styled from 'styled-components/native';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';

const TotalWrapper = styled.View`
flex:1;
background-color:${theme.colors.backgroundMainColor};
`;


const SetPinScreen = ({ navigation }) =>{

    return <TotalWrapper>
    <StyledText color="white">핀설정 스크린</StyledText>
    </TotalWrapper>
}

export default SetPinScreen;