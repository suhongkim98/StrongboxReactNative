import React, {useState, useEffect} from 'react';
import {View, Alert} from 'react-native';
import styled from 'styled-components/native';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import theme from '../../styles/theme';
import PinBox from '../../components/PinBox';
import StyledText from '../../components/StyledText';
import InputNumberKeyboard from '../../components/InputNumberKeyboard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalPopup from '../../components/ModalPopup';

const TotalWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.mainColor};
`;
const ViewBody = styled.View`
  flex: 0.65;
  justify-content: space-evenly;
  align-items: center;
`;
const PaddingView = styled.View`
  width: 100%;
  padding: 0 40px 0 40px;
`;
const PinView = styled.View`
  width: 100%;
  height: 140px;
  justify-content: space-evenly;
  align-items: center;

  border-radius: 5px;
`;
const InputView = styled.View`
  flex: 0.35;
  background-color: #e9e9ea;
`;

const LoginScreen = ({navigation}) => {
  const PIN_LENGTH = 6;
  const [pin, setPin] = useState('');
  const [losePasswordModal, setLosePasswordModal] = useState(false);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      //로그인
      const database = StrongboxDatabase.getInstance();
      database
        .validUser(pin)
        .then((result) => {
          if (result !== false) {
            // 로그인 성공
            global.key = result;
            navigation.reset({routes: [{name: 'Main'}]});
          } else {
            //로그인 실패 // 비밀번호 틀림
            Alert.alert('비밀번호가 일치하지 않습니다.', '다시 입력해주세요', [
              {
                text: '확인',
                onPress: () => {
                  setPin('');
                },
              },
            ]);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, [navigation, pin]);

  return (
    <TotalWrapper>
      <ModalPopup
        containerWidth="400px"
        containerHeight="200px"
        headerTitle="비밀번호 분실"
        onBackdropPress={() => {setLosePasswordModal(false)}}
        onAgree={() => {setLosePasswordModal(false)}}
        onAgreeTitle="확인"
        isVisible={losePasswordModal}>
          <StyledText>
            모든 계정 정보는 암호화가 되어있어 복구가 불가능합니다. 앱을 삭제하고 다시 설치해주세요. 계정정보는 사라집니다.
            {'\n\n'}만약 Accong Box 데스크톱 응용프로그램에 계정 정보가 살아있고 핀번호를 알고 있다면 동기화 기능을 통해 복구가 가능합니다.
          </StyledText>
      </ModalPopup>     
      <ViewBody>
        <StyledText color="white" fontWeight="700" size="30px">
          Accong Box
        </StyledText>
        <PaddingView>
          <PinView>
            <StyledText color="lightyellow" fontWeight="700" size="30px">
              Pin 입력
            </StyledText>
            <PinBox val={pin} length={PIN_LENGTH} />
          </PinView>
        </PaddingView>
        <View style={{paddingBottom: 50}}>
          <TouchableOpacity onPress={() => {setLosePasswordModal(true);}}>
            <StyledText color="lightyellow" fontWeight="600" size="13px" center>
              (!) 비밀번호를 분실하셨나요?
            </StyledText>  
          </TouchableOpacity>
          
        </View>
      </ViewBody>
      <InputView>
        <InputNumberKeyboard typingFunc={setPin} text={pin} />
      </InputView>
    </TotalWrapper>
  );
};

export default LoginScreen;
