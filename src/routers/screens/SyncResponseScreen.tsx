import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import theme from '../../styles/theme';

const TotalWrapper = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  margin: 0 0 20px 0;
`;
const InputBox = styled.TextInput`
  border-style: solid;
  border-color: gray;
  border-bottom-width: 1px;
  margin: 10px 0 0 0;
`;
const SyncButton = styled.TouchableOpacity`
  border: solid gray 1px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  background-color: ${theme.colors.mainColor};
`;

const InputItem = styled.View `
    margin: 20px 0 0 0;
`
const SyncResponseScreen = (props: any) => {
    const [name, setName] = useState('');
    const [vertificationCode, setVertificationCode] = useState('');

    const [toastVisible, setToastVisible] = useState(false);
    const toastTimer: any = useRef<number>(-1);
    const [toastMessage, setToastMessage] = useState('');
  
    const showToastMessage = (message: string) => {
      // toast 보여주는 함수
      setToastMessage(message);
      setToastVisible(true);
      if (toastTimer.current !== -1) {
        clearTimeout(toastTimer.current);
        toastTimer.current = -1;
      }
      toastTimer.current = setTimeout(() => {
        setToastVisible(false);
      }, 2000);
    };
    const onPressSyncButton = () => {
        if(name === '') {
            Alert.alert('이름을 입력해야 합니다.', '다시 입력해주세요', [
                {
                  text: '확인',
                  onPress: () => {},
                },
            ]);
            return;
        }
        if(vertificationCode === '') {
            Alert.alert('코드를 입력해야 합니다.', '다시 입력해주세요.', [
                {
                    text: '확인',
                    onPress: () => {},
                },
            ]);
            return;
        }
        //ajax로 서버에 요청
        const params = new URLSearchParams();
        params.append('name', global.name);
        params.append('vertificationCode', vertificationCode);
        axios.post('http://localhost:8080/sync/responseSync', params).then((response: any) => {
            const roomId = response.data.data[0].roomId;
            const vertificationCode = response.data.data[0].vertificationCode;
            const token = response.data.data[1].token;
            const requestorName = response.data.data[0].requestorName;

            global.syncInfo = {roomId: roomId, token: token};

            props.navigation.navigate('SyncConnectSuccess',{
                otherPartName: requestorName,
                vertificationCode: vertificationCode,
            });
        }).catch((error) => {
            if(error.response) {
                showToastMessage('인증번호가 일치하지 않습니다.');
            }
            else if(error.request) {
                showToastMessage('동기화 서버가 점검 중입니다.');
            } else {
                showToastMessage('잘못된 요청입니다.');
            }
        });
        //
    }
    return (<StackScreenContainer screenName="동기화 응답하기" onPressBackButton={() => {props.navigation.goBack();}}>
        <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}>
        {toastMessage}
        </Toast>
        <TotalWrapper>
            <View>
                <InputItem>
                    <StyledText>상대방에게 보여줄 이름을 입력해주세요.</StyledText>
                    <InputBox onChangeText={text => setName(text)}/>
                </InputItem>
                <InputItem>
                    <StyledText>상대방이 제공한 인증번호를 입력해주세요.</StyledText>
                    <InputBox onChangeText={text => setVertificationCode(text)}/>
                </InputItem>
            </View>
            <View>
                <StyledText center>상대방과 계정 정보를 동기화할 수 있습니다.{'\n'}이름을 입력한 후 동기화버튼을 눌러주세요.
                {'\n\n'}아이디가 일치한데 비밀번호가 다른경우{'\n'}
                <StyledText color='red' fontWeight="700">가장 최근에 추가된 계정 정보로</StyledText> 업데이트 되니
                {'\n'}참고하시기 바랍니다.
                </StyledText>
            </View>
            <SyncButton onPress={() => {onPressSyncButton();}}><StyledText color='white' fontWeight="700">동기화하기</StyledText></SyncButton>
        </TotalWrapper>
    </StackScreenContainer>);
}

export default SyncResponseScreen;
