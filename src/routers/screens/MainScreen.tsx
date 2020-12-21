import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import {Button} from 'react-native';
import {StrongboxDatabase} from '../../StrongboxDatabase.ts';
import {useDispatch} from 'react-redux';
import {updateGroup} from '../../modules/groupList';

const TotalWrapper = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const MainScreen = ({route, navigation}) => {
  const dispatch = useDispatch();

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
      <Button
        title="메뉴열기"
        onPress={() => {
          navigation.toggleDrawer();
        }}
      />
      <StyledText color="black">
        메인 {route.params && route.params.SERVICE_IDX}
      </StyledText>
    </TotalWrapper>
  );
};

export default MainScreen;
