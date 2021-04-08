import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import Icon from 'react-native-vector-icons/Ionicons';
import { stompConnect, stompDisconnect, stompSendMessage, isWebsocketConnected } from '../../modules/SyncWebsocketContainer';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import {updateGroupAsync} from '../../modules/groupList';
import {updateServiceAsync} from '../../modules/serviceList';
import CryptoJS from 'react-native-crypto-js';
import { ActivityIndicator } from 'react-native';
import Loading from '../../components/Loading';

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
  
    const {otherPartName, vertificationCode} = props.route.params; // 상대방 이름과 코드
    const [agreeFlag, setAgreeFlag] = useState(false); // 내가 동의 했는지 여부
    const [counterPartAgreeFlag, setCounterPartAgreeFlag] = useState(false); // 상대방 동의 여부
    const [receiveFlag, setReceiveFlag] = useState(false); // 상대방으로부터 데이터를 성공적으로 받았을 때
    const [dataSendFlag, setDataSendFlag] = useState(false); // 내가 보낸 데이터를 상대방이 받았을 때
    const syncData = useRef();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        stompConnect(onResponseMessage).then((result) => {
            // 화면 연결 시 소켓 연결
            console.log('소켓 연결');
            stompSendMessage('CONNECT_SUCCESS', global.name);
        }).catch((error) => {
            console.log(error);
        });

        return () => {
            console.log('소켓 연결 해제');
            if(isWebsocketConnected()) {
                stompSendMessage('SYNC_DENY', '동기화 거부');
                stompDisconnect();
            }
        }
    }, []);

    useEffect(() => {
        if(counterPartAgreeFlag && agreeFlag) {
            const database = StrongboxDatabase.getInstance();
            database.getAllSyncData().then((result: any) => {
                //계정정보 상대방에게 건내주기
                const data = result;
                const accounts: any = result.accounts;
                for(let i = 0 ; i < accounts.length ; i++) {
                    let bytes = CryptoJS.AES.decrypt(accounts[i].PASSWORD, global.key);
                    let decrypted = bytes.toString(CryptoJS.enc.Utf8);

                    accounts[i].PASSWORD = decrypted; // 복호화
                }
                data.accounts = accounts;

                stompSendMessage("DATA", JSON.stringify(data));
            }).catch((error) => {
                console.error(error);
                onPressBackButtonEvent();
            });
            setAgreeFlag(false); // 나는 동의여부 false로 바꾸어주고
        }
        
    }, [counterPartAgreeFlag, agreeFlag]);

    useEffect(() => {
        // 상대방의 데이터를 내가 잘 받았고
        // 내가 보낸 데이터가 상대방이 잘 받았을 경우
        if(receiveFlag && dataSendFlag) {
            //데이터를 잘 받았으므로 동기화 함수 호출하고 disconnect
            setLoading(true);
            stompDisconnect(); // 연결 종료

            const database = StrongboxDatabase.getInstance();
            database.syncData(syncData.current).then((result) => {
                setLoading(false);
                updateGroupAsync();
                updateServiceAsync();
                onPressBackButtonEvent(); // 동기화 완료 후 나가기
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [receiveFlag, dataSendFlag]);
    
    const onResponseMessage = (response: any) => {
        const message = JSON.parse(response.body);
        console.log(message);

        if(message.senderToken === global.syncInfo.token) {
            return;
        }
        if(message.type === 'SYNC_DENY') {
            onPressBackButtonEvent();
        } else if(message.type === 'SYNC_AGREE') {
            setCounterPartAgreeFlag(true);
        } else if(message.type === 'DATA') {
            const data = JSON.parse(message.message);
            syncData.current = data;
            setReceiveFlag(true);
            stompSendMessage('SYNC_RECEIVE', '동기화 데이터 잘 받음');
        } else if(message.type === 'SYNC_RECEIVE') {
            setDataSendFlag(true);
        }
    }
    const onAgreeSync = () => {
        stompSendMessage('SYNC_AGREE', '동기화 찬성');
        setAgreeFlag(true);
    }
    const onPressBackButtonEvent = () => {
        props.navigation.reset({routes: [{name: 'Main'}]});
    }
    return (<StackScreenContainer screenName="연결 성공" onPressBackButton={onPressBackButtonEvent}>
        {isLoading && <Loading text="동기화 진행 중" />}
        <TotalWrapper>
            <InnerItem><StyledText size="20px" fontWeight="700">연결 성공!</StyledText></InnerItem>
            <InnerItem>
                <Icon name="person" size={50} color="black" />
                <StyledText size="20px">이름: {otherPartName}</StyledText>
                <StyledText size="20px">인증 번호: {vertificationCode}</StyledText>
            </InnerItem>
            <InnerItem>
                <StyledText center>
                다른 기기의 이름과 인증 번호를 <StyledText color="red" fontWeight="700">꼭</StyledText> 확인하신 후 {'\n'}동의 버튼을 눌러주세요.{'\n\n'}이 단계에서 동기화를 하는 순간
                {'\n'}다른 기기에게 계정정보가 보내집니다.
                </StyledText>
            </InnerItem>
            <InnerButtonItem>
                <SyncButton onPress={onAgreeSync}>
                    {!agreeFlag ? <StyledText>동의</StyledText> : <StyledText>동의완료</StyledText>}
                </SyncButton>
                <SyncButton onPress={onPressBackButtonEvent}><StyledText>취소</StyledText></SyncButton>
            </InnerButtonItem>
        </TotalWrapper>
    </StackScreenContainer>);
}

export default SyncConnectSuccess;
