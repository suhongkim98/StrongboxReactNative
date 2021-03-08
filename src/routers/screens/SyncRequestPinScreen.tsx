import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import { useInterval } from '../../modules/customHook';

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
    
    useInterval(() =>{ // 커스텀 훅 사용
        setCount(count - 1);
    }, count > 0 ? 1000 : null); // 카운트가 0보다 크면 1초마다 반복

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
                <StyledText size="50px" fontWeight="700">123456</StyledText>
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
