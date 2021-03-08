import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
const TotalWrapper = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
const InnerItem = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InnerButtonItem = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const SyncButton = styled.TouchableOpacity`
  padding: 0 20px 0 20px;
`;
const SyncConnectSuccess = (props: any) => {

    useEffect(() => {
        console.log('진입');
        const unsubscribe = props.navigation.addListener('blur', () => {
          //화면 이탈 시 발생 이벤트
          console.log('이탈');
        });
        return unsubscribe;
      }, [props.navigation]);

    const onPressBackButtonEvent = () => {
        props.navigation.goBack();
    }
    return (<StackScreenContainer screenName="연결 성공" onPressBackButton={onPressBackButtonEvent}>
        <TotalWrapper>
            <InnerItem><StyledText size="20px" fontWeight="700">연결 성공!</StyledText></InnerItem>
            <InnerItem>
                <Icon name="person" size={50} color="black" />
                <StyledText size="20px">이름: aa</StyledText>
                <StyledText size="20px">인증 번호: 123123</StyledText>
            </InnerItem>
            <InnerItem>
                <StyledText center>
                상대방의 이름과 인증 번호를 <StyledText color="red" fontWeight="700">꼭</StyledText> 확인하신 후 {'\n'}동기화 버튼을 눌러주세요.{'\n\n'}이 단계에서 동기화를 하는 순간
                {'\n'}상대방에게 계정정보가 보내집니다.
                </StyledText>
            </InnerItem>
            <InnerButtonItem>
                <SyncButton><StyledText>동기화</StyledText></SyncButton>
                <SyncButton onPress={onPressBackButtonEvent}><StyledText>취소</StyledText></SyncButton>
            </InnerButtonItem>
        </TotalWrapper>
    </StackScreenContainer>);
}

export default SyncConnectSuccess;
