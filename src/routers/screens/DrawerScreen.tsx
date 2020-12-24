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
import {updateSelectedItemIndex} from '../../modules/selectedService';
import BottomSlide from '../../components/BottomSlide';

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
const SlideItem = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  justify-content: center;
`;
const SlideInnerWrapper = styled.View`
  width: 100%;
`;
const Hr = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-color: gray;
`;

const DrawerScreen = (props) => {
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const addGroupTextValue = useRef('');
  const dispatch = useDispatch();
  const groupList = useSelector((state: RootState) => state.groupList.list);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<number>(-1);
  const [bottomSlideVisible, setBottomSlideVisible] = useState(false);

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
      <BottomSlide
        width="100%"
        height="150px"
        isVisible={bottomSlideVisible}
        onClose={() => {
          setBottomSlideVisible(false);
        }}>
        <SlideInnerWrapper>
          <SlideItem
            onPress={() => {
              setBottomSlideVisible(false);
              setAddGroupModalVisible(true);
            }}>
            <StyledText>폴더 추가</StyledText>
          </SlideItem>
          <SlideItem>
            <StyledText>서비스 추가</StyledText>
          </SlideItem>
          <Hr />
          <SlideItem>
            <StyledText>편집</StyledText>
          </SlideItem>
        </SlideInnerWrapper>
      </BottomSlide>
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
                  onPress={() => {
                    dispatch(
                      updateSelectedItemIndex({
                        idx: 1,
                        name: '서비스이름 넣기',
                      }),
                    );
                    props.navigation.jumpTo('MainScreen', {
                      SERVICE_IDX: 1,
                      SERVICE_NAME: '서비스이름 넣기',
                    });
                  }}>
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
            setBottomSlideVisible(true);
          }}>
          <StyledText color="white" size="14px">
            수정하기
          </StyledText>
        </AddFolderButton>
      </FooterWrapper>
    </TotalWrapper>
  );
};

export default DrawerScreen;
