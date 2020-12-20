import React, {useState, useRef} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import GroupFolder from '../../components/GroupFolder';
import ModalPopup from '../../components/ModalPopup';

const TotalWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.backgroundMainColor};
  padding: 20px;
`;
const HeaderWrapper = styled.View`
  flex: 0.1;
`;
const BodyWrapper = styled.View`
  flex: 0.9;
`;
const FooterWrapper = styled.View`
  width: 100%;
`;
const AddFolderButton = styled.TouchableOpacity`
  height: 30px;
  border-width: 1px;
  border-style: solid;
  border-color: gray;
  border-radius: 5px;

  align-items: center;
  justify-content: center;
`;
const GroupTextInput = styled.TextInput``;

const DrawerScreen = (props) => {
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const addGroupTextValue = useRef('');

  const onAddFolder = () => {
    const database = StrongboxDatabase.getInstance();
    database
      .addGroup(addGroupTextValue.current)
      .then((result) => {
        console.log(result.rowid + '랑' + result.groupName); //get row id //addGroupList({GRP_IDX: result.rowid, GRP_NAME: result.groupName});
        setAddGroupModalVisible(false);
        //redux 건들기
        //알림Toast 추가하기
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <TotalWrapper>
      <ModalPopup
        containerWidth="300px"
        containerHeight="150px"
        isVisible={addGroupModalVisible}
        headerTitle="폴더 추가"
        onAgreeTitle="폴더 생성"
        onDenyTitle="취소"
        onAgree={onAddFolder}
        onDeny={() => {
          setAddGroupModalVisible(false);
        }}
        onBackdropPress={() => {
          setAddGroupModalVisible(false);
        }}>
        <GroupTextInput
          onChangeText={(text) => {
            addGroupTextValue.current = text;
            console.log(addGroupTextValue.current);
          }}
          placeholder="이름을 입력해주세요"
        />
      </ModalPopup>
      <HeaderWrapper>
        <StyledText color="white" size="20px">
          Accong Box
        </StyledText>
        <StyledText color="red" size="20px">
          검색바 넣을 곳
        </StyledText>
      </HeaderWrapper>
      <BodyWrapper>
        <DrawerContentScrollView {...props}>
          <GroupFolder groupName="test">
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 1})
              }>
              <StyledText size="20px" color="white">
                t1
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 2})
              }>
              <StyledText size="20px" color="white">
                t2
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 3})
              }>
              <StyledText size="20px" color="white">
                t2
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 4})
              }>
              <StyledText size="20px" color="white">
                t2
              </StyledText>
            </TouchableOpacity>
          </GroupFolder>
          <GroupFolder groupName="test2">
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 5})
              }>
              <StyledText size="20px" color="white">
                t1
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 6})
              }>
              <StyledText size="20px" color="white">
                t2
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 7})
              }>
              <StyledText size="20px" color="white">
                t2
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 8})
              }>
              <StyledText size="20px" color="white">
                t2
              </StyledText>
            </TouchableOpacity>
          </GroupFolder>
        </DrawerContentScrollView>
      </BodyWrapper>
      <FooterWrapper>
        <AddFolderButton
          onPress={() => {
            setAddGroupModalVisible(true);
          }}>
          <StyledText color="white" size="14px">
            폴더 추가하기
          </StyledText>
        </AddFolderButton>
      </FooterWrapper>
    </TotalWrapper>
  );
};

export default DrawerScreen;
