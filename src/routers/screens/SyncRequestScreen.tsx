import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import theme from '../../styles/theme';
import {SERVER_NAME} from '../../global.d';
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
  padding: 0 10px 0 10px;
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

const SyncRequestScreen = (props: any) => {
    const [name, setName] = useState('');

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
        //ajax로 서버에 요청
        global.name = name;
        //
        const params = new URLSearchParams();
        params.append('name', global.name);
        axios.post(SERVER_NAME + '/sync/requestSync',params).then((response) => {
            const roomId = response.data.data[0].roomId;
            const vertificationCode = response.data.data[0].vertificationCode;
            const token = response.data.data[1].token;
            
            global.syncInfo = {roomId: roomId, token: token};
            props.navigation.navigate('SyncRequestPinScreen',{
                vertificationCode: vertificationCode,
            });
        }).catch((error) => {
            if (error.response) {
                // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                showToastMessage('방 생성에 문제가 있습니다.');
              }
              else if (error.request) {
                // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                // Node.js의 http.ClientRequest 인스턴스입니다.
                console.log(error.request);
                showToastMessage('서버가 점검 중입니다.');
              }
              else {
                // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                console.log('Error', error.message);
                showToastMessage('서버가 점검 중입니다.');
              }
        });
        //
    }
    return (<StackScreenContainer screenName="동기화 요청하기" onPressBackButton={() => {props.navigation.goBack();}}>
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
            </View>
            <View>
                <StyledText center>상대방과 계정 정보를 동기화할 수 있습니다.{'\n'}이름을 입력한 후 동기화버튼을 눌러주세요.
                {'\n\n'}<StyledText color='black' fontWeight="700">계정 이름이 같은 경우 </StyledText>
                <StyledText color='red' fontWeight="700">가장 최근에 추가된 계정 정보로</StyledText>{'\n'} 업데이트 되니 참고하시기 바랍니다.
                </StyledText>
            </View>
            <SyncButton onPress={() => {onPressSyncButton();}}><StyledText color='white' fontWeight="700">동기화하기</StyledText></SyncButton>
        </TotalWrapper>
    </StackScreenContainer>);
}

export default SyncRequestScreen;
