import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';

const TotalWrapper = styled.View`
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
  background-color: ${theme.colors.mainColor};

  padding: 0 40px 0 40px;
`;
const SetPinPressBtn = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-style: solid;
  border-width: 1px;
  border-color: gray;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const InitScreen = ({navigation}) => {
  return (
    <TotalWrapper>
      <StyledText fontWeight="700" color="white" size="40px">
        Accong Box
      </StyledText>
      <View>
        <StyledText fontWeight="700" color="white" size="20px" center>
          환영합니다!
        </StyledText>
        <StyledText color="white" size="15px" center>
          {'\n'}처음 접속하셨군요!{'\n'}계정 암호화를 위해 핀번호를 설정해주세요
        </StyledText>
      </View>
      <SetPinPressBtn
        onPress={() => {
          navigation.reset({routes: [{name: 'SetPin'}]});
        }}>
        <StyledText fontWeight="700" color="white" size="15px">
          핀번호 설정
        </StyledText>
      </SetPinPressBtn>
    </TotalWrapper>
  );
};

export default InitScreen;
