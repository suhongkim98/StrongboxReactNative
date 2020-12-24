import React, {useRef} from 'react';
import ModalPopup from './ModalPopup';
import {StrongboxDatabase} from '../StrongboxDatabase';
import styled from 'styled-components/native';
import {addGroup} from '../modules/groupList';
import {useDispatch} from 'react-redux';
import {Alert} from 'react-native';
interface AddGroupModalPopupProps {
  visible: boolean;
  visibleFunc: (visible: boolean) => any;
  toastFunc: (message: string) => any;
}
const GroupTextInput = styled.TextInput``;

const AddGroupModalPopup = ({
  visible,
  visibleFunc,
  toastFunc,
}: AddGroupModalPopupProps) => {
  const addGroupTextValue = useRef('');
  const dispatch = useDispatch();

  const addFolder = () => {
    if (addGroupTextValue.current === '') {
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
      .addGroup(addGroupTextValue.current)
      .then((result) => {
        visibleFunc(false);
        //redux 건들기
        dispatch(addGroup({GRP_IDX: result.rowid, GRP_NAME: result.groupName}));
        //알림Toast 추가하기
        toastFunc('폴더를 추가했습니다.');
        addGroupTextValue.current = '';
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ModalPopup
      containerWidth="300px"
      containerHeight="150px"
      isVisible={visible}
      headerTitle="폴더 추가"
      onAgreeTitle="생성"
      onDenyTitle="취소"
      onAgree={addFolder}
      onDeny={() => {
        visibleFunc(false);
      }}
      onBackdropPress={() => {
        visibleFunc(false);
      }}>
      <GroupTextInput
        onChangeText={(text) => {
          addGroupTextValue.current = text;
        }}
        placeholder="이름을 입력해주세요"
      />
    </ModalPopup>
  );
};

export default AddGroupModalPopup;
