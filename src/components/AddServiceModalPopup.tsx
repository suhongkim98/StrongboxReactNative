import React, {useRef, useState} from 'react';
import {Alert, View} from 'react-native';
import ModalPopup from './ModalPopup';
import {StrongboxDatabase} from '../StrongboxDatabase';
import styled from 'styled-components/native';
import {addService} from '../modules/serviceList';
import {useDispatch} from 'react-redux';
import ServiceDropdown from './ServiceDropdown';
import StyledText from './StyledText';

interface AddServiceModalPopupProps {
  visible: boolean;
  visibleFunc: (visible: boolean) => any;
  toastFunc: (message: string) => any;
}
const ServiceTextInput = styled.TextInput`
  border-width: 1px;
  height: 30px;
  padding: 0 10px 0 10px;
  border-color: gray;
  border-radius: 3px;
`;
const BodyWrapper = styled.View`
  height: 100%;
  justify-content: space-evenly;
`;

const AddServiceModalPopup = ({
  visible,
  visibleFunc,
  toastFunc,
}: AddServiceModalPopupProps) => {
  const addServiceTextValue = useRef('');
  const [groupIdx, setGroupIdx] = useState(-1);
  const dispatch = useDispatch();

  const initInputValue = () => {
    addServiceTextValue.current = '';
    setGroupIdx(-1);
  };

  const onAddService = () => {
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
    database // grp-idx, service이름 매개변수로
      .addService(groupIdx, addServiceTextValue.current)
      .then((result) => {
        console.log(
          result.rowid + '랑 ' + result.serviceName + '그룹idx ' + groupIdx,
        );
        visibleFunc(false);
        //redux 건들기
        dispatch(
          addService({
            GRP_IDX: groupIdx,
            SERVICE_IDX: result.rowid,
            SERVICE_NAME: result.serviceName,
          }),
        );
        //알림Toast 추가하기
        toastFunc('서비스를 추가했습니다.');
        initInputValue();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ModalPopup
      containerWidth="300px"
      containerHeight="250px"
      isVisible={visible}
      headerTitle="서비스 추가"
      onAgreeTitle="생성"
      onDenyTitle="취소"
      onAgree={onAddService}
      onDeny={() => {
        visibleFunc(false);
      }}
      onBackdropPress={() => {
        visibleFunc(false);
      }}>
      <BodyWrapper>
        <View>
          <StyledText>그룹 선택</StyledText>
          <ServiceDropdown setGroupFunc={setGroupIdx} />
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
    </ModalPopup>
  );
};

export default AddServiceModalPopup;
