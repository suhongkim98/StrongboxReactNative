import React, {useEffect, useState, useRef} from 'react';
import {Alert} from 'react-native';
import EditView from '../../components/EditView';
import StyledText from '../../components/StyledText';
import DraggableFlatList from 'react-native-draggable-flatlist';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../styles/theme';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import ToggleSwitch from '../../components/ToggleSwitch';
import {useSelector, useDispatch} from 'react-redux';
import {updateAccountAsync} from '../../modules/accountList.ts';

const ListItemWrapper = styled.View`
  width: 100%;
  height: 50px;
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.colors.backgroundMainColor};
`;
const StyledIcon = styled(Icon)`
  font-size: 30px;
  height: 22px;
  color: black;
`;
const Draggable = styled.TouchableOpacity`
  height: 100%;
  width: 50px;
  justify-content: center;
  align-items: center;
`;
const ItemView = styled.View`
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const EditAccountScreen = ({navigation, route}) => {
  const {serviceIdx} = route.params;
  const [targetList, setTargetList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [count, setCount] = useState(0);
  const deleteAccountList = useRef([]);
  const deleteOauthAccountList = useRef([]);
  const accountList = useSelector((state: RootState) => state.accountList.list);
  const dispatch = useDispatch();
  /*
  1 데이터가 들어오면, 삭제 되면 데이터들의 sort order부터 뽑아내 따로 저장
  2 리스트에 변화가 발생하면 위에서부터 순서대로 sort order 업데이트
  */
  useEffect(() => {
    console.log('진입');
    const unsubscribe = navigation.addListener('blur', () => {
      //화면 이탈 시 발생 이벤트 초기화하자
      console.log('이탈');
    });
    setTargetList(accountList);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigation]);

  useEffect(() => {
    const tmp = [];
    for (let i = 0; i < accountList.length; i++) {
      const element = accountList[i];
      tmp.push(element.SORT_ORDER);
    }
    setOrderList(tmp);
  }, [accountList]);
  const renderItem = ({item, drag}) => {
    return (
      <ListItemWrapper>
        <ItemView>
          <Draggable onLongPress={drag}>
            <StyledIcon name="drag-handle" />
          </Draggable>
          <StyledText size="20px">{item.ACCOUNT_NAME}</StyledText>
        </ItemView>
        <ToggleSwitch
          navigation={navigation}
          onTrue={() => {
            if (item.OAUTH_SERVICE_NAME === undefined) {
              //oath계정
              deleteAccountList.current.push(item.IDX);
            } else {
              deleteOauthAccountList.current.push(item.IDX);
            }
            setCount(count + 1);
          }}
          onFalse={() => {
            if (item.OAUTH_SERVICE_NAME === undefined) {
              //oath계정
              for (let i = 0; i < deleteAccountList.current.length; i++) {
                const account = deleteAccountList.current[i];
                if (account === item.IDX) {
                  deleteAccountList.current.splice(i, 1);
                  break;
                }
              }
            } else {
              for (let i = 0; i < deleteOauthAccountList.current.length; i++) {
                const account = deleteOauthAccountList.current[i];
                if (account === item.IDX) {
                  deleteOauthAccountList.current.splice(i, 1);
                  break;
                }
              }
            }
            setCount(count - 1);
          }}
        />
      </ListItemWrapper>
    );
  };
  const onDragEnd = (newData) => {
    //리스트 변화 시
    const [accountOrder, oauthOrder] = [[], []];
    const [accountIdx, oauthIdx] = [[], []];
    for (let i = 0; i < newData.length; i++) {
      newData[i].SORT_ORDER = orderList[i]; //순서 변경
      if (newData[i].OAUTH_SERVICE_NAME !== undefined) {
        //oauth계정
        oauthIdx.push(newData[i].IDX);
        oauthOrder.push(orderList[i]);
      } else {
        accountIdx.push(newData[i].IDX);
        accountOrder.push(orderList[i]);
      }
    }
    setTargetList(newData);
    //DB업데이트 account, ouath에 따라 sort order 변경
    const database = StrongboxDatabase.getInstance();
    database
      .updateSortOrder('ACCOUNTS_TB', accountIdx, accountOrder)
      .then(() => {
        dispatch(updateAccountAsync(serviceIdx));
      })
      .catch((error) => {
        console.log(error);
      });
    database
      .updateSortOrder('OAUTH_ACCOUNTS_TB', oauthIdx, oauthOrder)
      .then(() => {
        dispatch(updateAccountAsync(serviceIdx)); //account리스트 db 수정
      })
      .catch((error) => {
        console.log(error);
      });
    //redux 건들어 업데이트
    setTargetList(newData);
  };

  const onAgree = () => {
    const database = StrongboxDatabase.getInstance();
    //deleteAccountList 해당 계정 삭제
    database
      .deleteAccount('ACCOUNTS_TB', deleteAccountList.current)
      .then(() => {
        dispatch(updateAccountAsync(serviceIdx)); //account리스트 db 수정
      })
      .catch((error) => {
        console.log(error);
      });
    //deleteOauthAccountList 해당 계정 삭제
    database
      .deleteAccount('OAUTH_ACCOUNTS_TB', deleteOauthAccountList.current)
      .then(() => {
        dispatch(updateAccountAsync(serviceIdx)); //account리스트 db 수정
      })
      .catch((error) => {
        console.log(error);
      });

    navigation.goBack();
  };
  return (
    <EditView
      isSelected={count > 0}
      onPressBackButton={() => {
        navigation.goBack();
      }}
      onPressDeleteButton={() => {
        Alert.alert(
          '정말 삭제하시겠습니까?',
          '복구가 불가능합니다.',
          [
            {
              text: '확인',
              onPress: onAgree,
            },
            {
              text: '취소',
              onPress: () => {},
            },
          ],
          {cancelable: true},
        );
      }}>
      <DraggableFlatList
        data={targetList}
        renderItem={renderItem}
        onDragEnd={({data}) => onDragEnd(data)}
        keyExtractor={(item) => `draggable-item-${item.SORT_ORDER}`}
      />
    </EditView>
  );
};
export default EditAccountScreen;
