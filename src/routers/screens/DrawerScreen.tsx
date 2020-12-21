import React, {useState, useRef} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import GroupFolder from '../../components/GroupFolder';
import ModalPopup from '../../components/ModalPopup';
import {useSelector, useDispatch} from 'react-redux';
import {addGroup} from '../../modules/groupList';
import Toast from 'react-native-root-toast';

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
  const dispatch = useDispatch();
  const groupList = useSelector((state: RootState) => state.groupList.list);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<number>(-1);

  const onAddFolder = () => {
    const database = StrongboxDatabase.getInstance();
    database
      .addGroup(addGroupTextValue.current)
      .then((result) => {
        setAddGroupModalVisible(false);
        //redux 건들기
        dispatch(addGroup({GRP_IDX: result.rowid, GRP_NAME: result.groupName}));
        //알림Toast 추가하기
        setToastVisible(true);
        if (toastTimer.current !== -1) {
          clearTimeout(toastTimer.current);
          toastTimer.current = -1;
        }
        toastTimer.current = setTimeout(() => {
          setToastVisible(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <TotalWrapper>
      <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}>
        폴더를 추가했습니다.
      </Toast>
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
          {groupList.map((row: any) => {
            return (
              <GroupFolder key={row.GRP_IDX} groupName={row.GRP_NAME}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.jumpTo('MainScreen', {SERVICE_IDX: 1})
                  }>
                  <StyledText size="20px" color="white">
                    test
                  </StyledText>
                </TouchableOpacity>
              </GroupFolder>
            );
          })}
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
