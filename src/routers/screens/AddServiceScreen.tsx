import React, { useRef, useState } from 'react';
import StackScreenContainer from '../../components/StackScreenContainer';
import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';

const BodyWrapper = styled.View`
  flex: 1;
  padding: 0 20px 0 20px;
`;

const FooterWrapper = styled.View`
  height: 80px;
  justify-content: center;
  align-items: center;
  padding: 0 20px 0 20px;
`;
const AddButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid gray;
`;
const AddServiceScreen = (props: any) => {

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

    const onPressBackButton = () => {
        props.navigation.goBack();
    }
    const onPressAddButton = () => {

    }

    return (<StackScreenContainer 
        screenName="서비스 추가"
        onPressBackButton={onPressBackButton}>
      <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}>
        {toastMessage}
      </Toast>
      <BodyWrapper>
      </BodyWrapper>
      <FooterWrapper>
        <AddButton
          onPress={() => {
            onPressAddButton();
          }}>
          <StyledText color="black" fontWeight="700">
            추가
          </StyledText>
        </AddButton>
      </FooterWrapper>
    </StackScreenContainer>);
}

export default AddServiceScreen;
