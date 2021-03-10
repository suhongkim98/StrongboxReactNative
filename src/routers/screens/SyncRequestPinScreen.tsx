import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import { useInterval } from '../../modules/customHook';
import { stompConnect, stompDisconnect } from '../../modules/SyncWebsocketContainer';

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
const CancelButton = styled.TouchableOpacity``;

const SyncRequestPinScreen = (props: any) => {
    const [count, setCount] = useState(30);
    const {vertificationCode} = props.route.params;
    
    useInterval(() =>{ // 커스텀 훅 사용
        setCount(count - 1);
    }, count > 0 ? 1000 : null); // 카운트가 0보다 크면 1초마다 반복

    useEffect(() => {
        stompConnect(onResponseMessage).then((result) => {
            // 화면 연결 시 소켓 연결
            console.log('소켓 연결');
        }).catch((error) => {
            console.log(error);
        });

        return () => {
            console.log('소켓 연결 해제');
            stompDisconnect();
        }
    }, []);
    const onResponseMessage = (response: any) => {
        const message = JSON.parse(response.body);
        console.log(message);
        if(message.type === "CONNECT_SUCCESS") {
            // 동기화 응답자가 핀번호를 제대로 입력했다는 메시지를 보내 올 경우
            props.navigation.navigate('SyncConnectSuccess', {
                otherPartName: message.sender,
                vertificationCode: vertificationCode,
            });
        }
    }
    const onPressBackButtonEvent = () => {
        props.navigation.goBack();
    }

    useEffect(()=>{
        if(count <= 0) {
            // 카운트 종료 시
            onPressBackButtonEvent();
        }
    },[count]);
    
    return (<StackScreenContainer screenName="동기화 요청하기" onPressBackButton={onPressBackButtonEvent}>
        <TotalWrapper>
            <InnerItem>
                <StyledText size="25px" fontWeight="700">ACCONG BOX</StyledText>
                <StyledText>{global.name}</StyledText>
                </InnerItem>
            <InnerItem>
                <StyledText size="20px">인증 번호</StyledText>
                <StyledText size="50px" fontWeight="700">{vertificationCode}</StyledText>
                <StyledText size="12px">유효시간 내에 인증 번호를 입력하세요.</StyledText>
            </InnerItem>
            <InnerItem>
                <StyledText size="35px" color="red" fontWeight="700">{count}</StyledText>
            </InnerItem>
            <InnerItem>
                <CancelButton onPress={onPressBackButtonEvent}>
                    <StyledText size="16px">취소</StyledText>
                </CancelButton>
            </InnerItem>
        </TotalWrapper>
    </StackScreenContainer>);
}

export default SyncRequestPinScreen;
