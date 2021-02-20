import React, { useRef, useState } from 'react';
import StackScreenContainer from '../../components/StackScreenContainer';
import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import { useDispatch } from 'react-redux';
import { Alert, View } from 'react-native';
import { StrongboxDatabase } from '../../StrongboxDatabase';
import { updateServiceAsync } from '../../modules/serviceList';
import GroupDropdown from '../../components/GroupDropdown';

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

const ServiceTextInput = styled.TextInput`
  border-width: 1px;
  height: 30px;
  padding: 0 10px 0 10px;
  border-color: gray;
  border-radius: 3px;
`;
const AddServiceScreen = (props: any) => {

  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer: any = useRef<number>(-1);
  const [toastMessage, setToastMessage] = useState('');
  const addServiceTextValue = useRef('');
  const [groupIdx, setGroupIdx] = useState(-1);
  const dispatch = useDispatch();

  const initInputValue = () => {
    addServiceTextValue.current = '';
    setGroupIdx(-1);
  };
    
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
      if (groupIdx < 0) {
        Alert.alert('그룹 선택을 해주셔야 합니다.', '다시 입력해주세요', [
          {
            text: '확인',
            onPress: () => {},
          },
        ]);
        return;
      }
      if (addServiceTextValue.current === '') {
        Alert.alert('이름을 입력해야 합니다.', '다시 입력해주세요', [
          {
            text: '확인',
            onPress: () => {},
          },
        ]);
        return;
      }
      const database = StrongboxDatabase.getInstance();
      database
        .isExistServiceName(addServiceTextValue.current, groupIdx)
        .then((result) => {
          if (result > 0) {
            //알림Toast 추가하기
            showToastMessage('이미 존재하는 서비스 이름입니다.');
            initInputValue();
          } else {
            database // grp-idx, service이름 매개변수로
              .addService(groupIdx, addServiceTextValue.current)
              .then(() => {
                //redux 건들기
                dispatch(updateServiceAsync());
                initInputValue();
                onPressBackButton();
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });

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
        <View>
            <StyledText>그룹 선택</StyledText>
            <GroupDropdown setGroupFunc={setGroupIdx} />
          </View>
          <View>
            <StyledText>서비스 이름</StyledText>
            <ServiceTextInput
              onChangeText={(text) => {
                addServiceTextValue.current = text;
              }}
              placeholder="이름을 입력해주세요"
            />
          </View>
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
