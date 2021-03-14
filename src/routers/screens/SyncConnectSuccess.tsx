import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import Icon from 'react-native-vector-icons/Ionicons';
import { stompConnect, stompDisconnect, stompSendMessage } from '../../modules/SyncWebsocketContainer';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import {updateGroupAsync} from '../../modules/groupList';
import {updateServiceAsync} from '../../modules/serviceList';
import CryptoJS from 'react-native-crypto-js';

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
    const [isSyncAgree, setSyncAgree] = useState(false);
    const [isOtherPartAgree, setOtherPartAgree] = useState(false);
    const [isFinish, setFinish] = useState(false);

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
            if(isFinish) {
                stompSendMessage('SYNC_FINISH', "동기화 종료");
            } else {
                stompSendMessage('SYNC_DENY', '동기화 거부');
            }
            stompDisconnect();
        }
    }, []);
    useEffect(() => {
        if(isFinish) {
            onPressBackButtonEvent();
        }
    }, [isFinish]);
    useEffect(() => {
        if(isOtherPartAgree && isSyncAgree) {
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
            setSyncAgree(false); // 나는 동의여부 false로 바꾸어주고
        }
        
    }, [isOtherPartAgree, isSyncAgree]);
    const onResponseMessage = (response: any) => {
        const message = JSON.parse(response.body);
        console.log(message);

        if(message.senderToken === global.syncInfo.token) {
            return;
        }
        if(message.type === 'SYNC_DENY') {
            onPressBackButtonEvent();
        } else if(message.type === 'SYNC_AGREE') {
            setOtherPartAgree(true);
        } else if(message.type === 'DATA') {
            const data = JSON.parse(message.message);
            const database = StrongboxDatabase.getInstance();
            database.syncData(data).then((result) => {
                updateGroupAsync();
                updateServiceAsync();
                setFinish(true);
            }).catch((error) => {
                console.error(error);
            });
        }
    }
    const onAgreeSync = () => {
        stompSendMessage('SYNC_AGREE', '동기화 찬성');
        setSyncAgree(true);
    }
    const onPressBackButtonEvent = () => {
        props.navigation.reset({routes: [{name: 'Main'}]});
    }
    return (<StackScreenContainer screenName="연결 성공" onPressBackButton={onPressBackButtonEvent}>
        <TotalWrapper>
            <InnerItem><StyledText size="20px" fontWeight="700">연결 성공!</StyledText></InnerItem>
            <InnerItem>
                <Icon name="person" size={50} color="black" />
                <StyledText size="20px">이름: {otherPartName}</StyledText>
                <StyledText size="20px">인증 번호: {vertificationCode}</StyledText>
            </InnerItem>
            <InnerItem>
                <StyledText center>
                상대방의 이름과 인증 번호를 <StyledText color="red" fontWeight="700">꼭</StyledText> 확인하신 후 {'\n'}동기화 버튼을 눌러주세요.{'\n\n'}이 단계에서 동기화를 하는 순간
                {'\n'}상대방에게 계정정보가 보내집니다.
                </StyledText>
            </InnerItem>
            <InnerButtonItem>
                <SyncButton onPress={onAgreeSync}><StyledText>동기화</StyledText></SyncButton>
                <SyncButton onPress={onPressBackButtonEvent}><StyledText>취소</StyledText></SyncButton>
            </InnerButtonItem>
        </TotalWrapper>
    </StackScreenContainer>);
}

export default SyncConnectSuccess;
