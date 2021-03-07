import React from 'react';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';

const TotalWrapper = styled.View`
  flex: 1;
`;
const MenuItem = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;

  border-style: solid;
  border-bottom-width: 1px;
  border-color: gray;

  padding-top: 10px;
`;
const SettingScreen = (props: any) => {
    return (<StackScreenContainer screenName="설정" onPressBackButton={() => {props.navigation.goBack();}}>
        <TotalWrapper>
            <MenuItem onPress={() => {
                props.navigation.navigate('SyncRequestScreen');
            }}><StyledText>계정 동기화 요청하기</StyledText></MenuItem>
            <MenuItem onPress={() => {
                props.navigation.navigate('SyncResponseScreen');
            }}><StyledText>계정 동기화 응답하기</StyledText></MenuItem>
        </TotalWrapper>
    </StackScreenContainer>);
}

export default SettingScreen;