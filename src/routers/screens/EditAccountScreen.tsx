import React, {useEffect, useState, useRef} from 'react';
import {Alert} from 'react-native';
import EditView from '../../components/EditView';
import StyledText from '../../components/StyledText';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../styles/theme';
import {updateAccountByIdx, deleteAccount} from '../../modules/accountList';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import ToggleSwitch from '../../components/ToggleSwitch';

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
  const accountList = useSelector((state: RootState) => state.accountList.list);
  const dispatch = useDispatch();
  const [targetList, setTargetList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [count, setCount] = useState(0);
  const deleteAccountList = useRef([]);
  const [rerenderDraggable, setRerenderDraggable] = useState(false); // DraggableFlatList에 버그가 있는 듯 하다 일단 임시로 이렇게 해결
  /*
  1 데이터가 들어오면, 삭제 되면 데이터들의 sort order부터 뽑아내 따로 저장
  2 리스트에 변화가 발생하면 위에서부터 순서대로 sort order 업데이트
  */
  useEffect(() => {
    //account리스트 redux에 변화가 있을 때마다 호출
    const accounts = accountList.filter((row) => {
      return row.SERVICE_IDX === serviceIdx;
    });
    const tmp = [];
    for (let i = 0; i < accounts.length; i++) {
      tmp.push(accounts[i].ORDER);
    }
    console.log('업데이트');
    setOrderList(tmp);
    setTargetList(accounts);
  }, [accountList, serviceIdx]);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      //화면 진입 시 발생 이벤트 초기화하자
      console.log('진입');
      setRerenderDraggable(true);
    });

    return subscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      //화면 이탈 시 발생 이벤트 초기화하자
      console.log('이탈');
      setCount(0);
      deleteAccountList.current = [];
      setRerenderDraggable(false);
    });

    return unsubscribe;
  }, [navigation]);

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
            deleteAccountList.current.push(item.ACCOUNT_IDX);
            setCount(count + 1);
          }}
          onFalse={() => {
            for (let i = 0; i < deleteAccountList.current.length; i++) {
              const account = deleteAccountList.current[i];
              if (account === item.ACCOUNT_IDX) {
                deleteAccountList.current.splice(i, 1);
                break;
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
    for (let i = 0; i < newData.length; i++) {
      newData[i].ORDER = orderList[i]; //순서 변경
    }
    //DB업데이트
    const database = StrongboxDatabase.getInstance();
    for (let i = 0; i < newData.length; i++) {
      database.updateSortOrder(
        'ACCOUNTS_TB',
        newData[i].ACCOUNT_IDX,
        newData[i].ORDER,
      );
    }
    //redux업데이트
    dispatch(updateAccountByIdx(newData));
  };

  const onAgree = () => {
    const database = StrongboxDatabase.getInstance();
    for (let i = 0; i < deleteAccountList.current.length; i++) {
      const accountIdx = deleteAccountList.current[i];
      database.deleteAccount(accountIdx);
      dispatch(deleteAccount(accountIdx));
    }

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
      {rerenderDraggable && (
        <DraggableFlatList
          data={targetList}
          renderItem={renderItem}
          onDragEnd={({data}) => onDragEnd(data)}
          keyExtractor={(item) => `draggable-item-${item.ACCOUNT_IDX}`}
        />
      )}
    </EditView>
  );
};
export default EditAccountScreen;
