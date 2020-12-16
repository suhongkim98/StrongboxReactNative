import React, {useRef, useState, useEffect} from 'react';
import {View, Alert} from 'react-native';
import styled from 'styled-components/native';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import theme from '../../styles/theme';
import PinBox from '../../components/PinBox';
import StyledText from '../../components/StyledText';
import InputNumberKeyboard from '../../components/InputNumberKeyboard';

const TotalWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.backgroundMainColor};
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

const SetPinScreen = ({navigation}) => {
  const PIN_LENGTH = 6;
  const [pin, setPin] = useState('');

  const [checkPin, setCheckPin] = useState(false);
  const beforePin = useRef('');

  useEffect(() => {
    if (!checkPin) {
      if (pin.length >= PIN_LENGTH) {
        setPin(''); //초기화
        setCheckPin(true);
        beforePin.current = pin;
      }
    } else {
      if (pin.length === PIN_LENGTH) {
        if (beforePin.current === pin) {
          //사용자 등록
          const database = StrongboxDatabase.getInstance();
          database
            .createUser(pin)
            .then((result) => {
              global.key = result; // 유저 등록 성공하면 키를 받아 글로벌 변수에 저장한다
            })
            .catch((error: any) => {
              console.log(error);
            });
          //스크린 이동
          navigation.reset({routes: [{name: 'Main'}]});
        } else {
          Alert.alert('비밀번호가 일치하지 않습니다.', '다시 입력해주세요', [
            {
              text: '확인',
              onPress: () => {
                setPin('');
                beforePin.current = '';
                setCheckPin(false);
              },
            },
          ]);
        }
      }
    }
  }, [checkPin, navigation, pin]);

  return (
    <TotalWrapper>
      <ViewBody>
        <StyledText color="white" fontWeight="700" size="30px">
          Accong Box
        </StyledText>
        <PaddingView>
          <PinView>
            {checkPin ? (
              <StyledText color="lightyellow" fontWeight="700" size="30px">
                Pin 확인
              </StyledText>
            ) : (
              <StyledText color="lightyellow" fontWeight="700" size="30px">
                Pin 설정
              </StyledText>
            )}
            <PinBox val={pin} length={PIN_LENGTH} />
          </PinView>
        </PaddingView>
        <View style={{paddingBottom: 50}}>
          <StyledText color="lightyellow" fontWeight="600" size="13px" center>
            (!) 핀번호는 데이터를 암호화하기 위한 중요한 암호입니다.{'\n'}
            분실하면 복구가 불가능하니 신중하게 설정해주세요.
          </StyledText>
        </View>
      </ViewBody>
      <InputView>
        <InputNumberKeyboard typingFunc={setPin} text={pin} />
      </InputView>
    </TotalWrapper>
  );
};

export default SetPinScreen;
