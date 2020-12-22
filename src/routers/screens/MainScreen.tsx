import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import {StrongboxDatabase} from '../../StrongboxDatabase.ts';
import {useDispatch, useSelector} from 'react-redux';
import {updateGroup} from '../../modules/groupList';
import MenuSVG from '../../images/MenuSVG';
import SettingSVG from '../../images/SettingSVG';
const TotalWrapper = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;
const HeaderWrapper = styled.View`
  padding: 0 20px 0 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: white;
  border-bottom-width: 1px;
  border-color: black;
  border-style: solid;
`;
const MenuButton = styled.TouchableOpacity``;
const BodyWrapper = styled.View`
  flex: 1;
  padding: 30px 20px 0 20px;
  flex-direction: column;
  align-items: center;
`;
const AdvertisementView = styled.View``; // 추후 광고 추가 예정

const MainScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const selectedService = useSelector(
    (state: RootState) => state.selectedService.itemIndex,
  );

  useEffect(() => {
    const database = StrongboxDatabase.getInstance();
    database
      .getGroup() // group redux 업데이트
      .then((result) => {
        const tmp = [];
        for (let i = 0; i < result.length; i++) {
          const row = result.item(i);
          tmp.push({GRP_IDX: row.IDX, GRP_NAME: row.GRP_NAME});
        }
        dispatch(updateGroup(tmp)); // 업데이트하자~~~~
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);
  return (
    <TotalWrapper>
      <HeaderWrapper>
        <MenuButton
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <MenuSVG width="20px" height="20px" color="black" />
        </MenuButton>
        {route.params && (
          <StyledText size="20px" fontWeight="700">
            {route.params.SERVICE_NAME}
          </StyledText>
        )}
        <MenuButton onPress={() => {}}>
          <SettingSVG width="20px" height="20px" color="black" />
        </MenuButton>
      </HeaderWrapper>
      <BodyWrapper>
        <StyledText color="black">
          {selectedService.idx > 0 ? (
            <StyledText>{selectedService.idx}</StyledText>
          ) : (
            <StyledText size="16px" fontWeight="700">
              선택한 계정이 없습니다.
            </StyledText>
          )}
        </StyledText>
      </BodyWrapper>
      <AdvertisementView />
    </TotalWrapper>
  );
};

export default MainScreen;
