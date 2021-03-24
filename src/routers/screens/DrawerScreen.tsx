import React, {useState, useRef} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import StyledText from '../../components/StyledText';
import GroupFolder from '../../components/GroupFolder';
import {useSelector} from 'react-redux';
import Toast from 'react-native-root-toast';
import BottomSlide from '../../components/BottomSlide';
import AddGroupModalPopup from '../../components/AddGroupModalPopup';
import { RootState } from '../../modules';
import Icon from 'react-native-vector-icons/AntDesign';

const TotalWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.mainColor};
  padding: 20px;
`;
const HeaderWrapper = styled.View`
  flex: 0.1;
  justify-content:space-between;
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
const SearchBar = styled.TouchableOpacity`
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 10px;
  background-color: white;
  border-radius: 5px;
`;

const DrawerScreen = (props) => {
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const groupList = useSelector((state: RootState) => state.groupList.list);
  const [bottomSlideVisible, setBottomSlideVisible] = useState(false);

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

  return (
    <TotalWrapper>
      <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}>
        {toastMessage}
      </Toast>
      <BottomSlide
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
          <SlideItem
            onPress={() => {
              setBottomSlideVisible(false);
              props.navigation.navigate('AddServiceScreen');
            }}>
            <StyledText>서비스 추가</StyledText>
          </SlideItem>
          <Hr />
          <SlideItem
            onPress={() => {
              setBottomSlideVisible(false);
              props.navigation.navigate('EditGroupListScreen');
            }}>
            <StyledText>편집</StyledText>
          </SlideItem>
        </SlideInnerWrapper>
      </BottomSlide>
      <AddGroupModalPopup
        visible={addGroupModalVisible}
        visibleFunc={setAddGroupModalVisible}
        toastFunc={showToastMessage}
      />
      <HeaderWrapper>
        <StyledText color="white" size="20px">
          Accong Box
        </StyledText>
        <SearchBar onPress={() => {
          props.navigation.navigate('SearchServiceScreen');
        }}>
          <StyledText color="gray">검색..</StyledText>
          <Icon color="black" name="search1"></Icon>
        </SearchBar>
      </HeaderWrapper>
      <BodyWrapper>
        <DrawerContentScrollView {...props}>
          {groupList.map((row: any) => {
            return (
              <GroupFolder
                key={row.GRP_IDX}
                groupName={row.GRP_NAME}
                groupIdx={row.GRP_IDX}
                navigation={props.navigation}
              />
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
