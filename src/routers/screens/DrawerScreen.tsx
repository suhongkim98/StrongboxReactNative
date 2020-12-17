import React, {useState} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import styled from 'styled-components/native';
import {Button} from 'react-native';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import Modal from 'react-native-modal';

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
const AddGroupModalWrapper = styled.View`
  flex: 1;
`;
const HideModalButton = styled.TouchableOpacity`
  border-style: solid;
  border-width: 1px;
  border-color: black;
`;
const StyleModel = styled(Modal)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ModalContainer = styled.View`
  width: 300px;
  height: 200px;
  background-color: white;
  border-radius: 5px;
`;
const DrawerScreen = (props) => {
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);

  // const onPressAddFolder = () => {
  //   const database = StrongboxDatabase.getInstance();
  //   database
  //     .addGroup('test')
  //     .then((result) => {
  //       console.log(result.rowid + '랑' + result.groupName); //get row id //addGroupList({GRP_IDX: result.rowid, GRP_NAME: result.groupName});
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  return (
    <TotalWrapper>
      <StyleModel
        isVisible={addGroupModalVisible}
        onBackdropPress={() => {
          setAddGroupModalVisible(false);
        }}
        useNativeDriver={true}>
        <ModalContainer>
          <AddGroupModalWrapper>
            <StyledText color="black">여기다가 그룹 이름 적기</StyledText>
            <HideModalButton
              onPress={() => {
                setAddGroupModalVisible(false);
              }}>
              <StyledText color="black">모달 닫기</StyledText>
            </HideModalButton>
          </AddGroupModalWrapper>
        </ModalContainer>
      </StyleModel>
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
          <Button
            title="계정1"
            onPress={() =>
              props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 1})
            } //기존화면으로 파라미터에 IDX를 넣고 이동
          />
          <Button
            title="계정2"
            onPress={() =>
              props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 2})
            }
          />
        </DrawerContentScrollView>
      </BodyWrapper>
      <FooterWrapper>
        <AddFolderButton
          onPress={() => {
            setAddGroupModalVisible(true);
          }}>
          <StyledText color="white" size="14px">
            폴더 추가
          </StyledText>
        </AddFolderButton>
      </FooterWrapper>
    </TotalWrapper>
  );
};

export default DrawerScreen;
