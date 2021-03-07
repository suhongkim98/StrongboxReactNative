import React, { useState } from 'react';
import { Alert, View } from 'react-native';
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

const SyncRequestScreen = (props: any) => {
    const [name, setName] = useState('');

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
        
        //
    }
    return (<StackScreenContainer screenName="동기화 요청하기" onPressBackButton={() => {props.navigation.goBack();}}>
        <TotalWrapper>
            <View>
                <InputItem>
                    <StyledText>상대방에게 보여줄 이름을 입력해주세요.</StyledText>
                    <InputBox onChangeText={text => setName(text)}/>
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

export default SyncRequestScreen;
