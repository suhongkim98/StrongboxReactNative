import React, { useEffect, useRef, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useDispatch, useSelector } from 'react-redux';
import EditView from '../../components/EditView';
import { RootState } from '../../modules';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StyledText from '../../components/StyledText';
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import ToggleSwitch from '../../components/ToggleSwitch';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StrongboxDatabase } from '../../StrongboxDatabase';
import { updateGroupAsync } from '../../modules/groupList';
import { Alert } from 'react-native';

const DraggableItemWrapper = styled.View`
  width: 100%;
  height: 50px;
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.colors.backgroundMainColor};
`;
const ItemView = styled.View`
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const EditGroupListScreen = (props: any) => {
  const [count, setCount] = useState(0);
  const [targetList, setTargetList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const groupList = useSelector((state: RootState) => state.groupList.list);
  const dispatch = useDispatch();
  const selectedList = useRef([]);

  useEffect(() => {
    //그룹 순서 뽑기
    const tmp = [];
    for (let i = 0; i < groupList.length; i++) {
      const element = groupList[i];
      tmp.push(element.SORT_ORDER);
    }
    setTargetList(groupList);
    setOrderList(tmp);
  }, [groupList]);

  useEffect(() => {
    console.log('진입');
    const unsubscribe = props.navigation.addListener('blur', () => {
      //화면 이탈 시 발생 이벤트 초기화하자
      console.log('이탈');
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, props.navigation]);

  const onPressBackButton = () => {
    props.navigation.goBack();
  };
  const onPressDeleteButton = () => {
    Alert.alert(
      '정말 삭제하시겠습니까?',
      '복구가 불가능합니다.',
      [
        {
          text: '확인',
          onPress: onAgreeDelete,
        },
        {
          text: '취소',
          onPress: () => { },
        },
      ],
      { cancelable: true },
    );
  };
  const onAgreeDelete = () => {
    const database = StrongboxDatabase.getInstance();
    if (selectedList.current.length > 0) {
      database
        .deleteGroup(selectedList.current)
        .then(() => {
          dispatch(updateGroupAsync());
        })
        .catch((error) => {
          console.log(error);
        });
    }
    props.navigation.goBack();
  }
  const onDragEnd = (newData: any) => {
    const grpIdx = [];
    for (let i = 0; i < newData.length; i++) {
      grpIdx.push(newData[i].GRP_IDX);
      newData[i].SORT_ORDER = orderList[i];
    }
    setTargetList(newData);
    const database = StrongboxDatabase.getInstance();
    database
      .updateSortOrder('GROUPS_TB', grpIdx, orderList)
      .then(() => {
        dispatch(updateGroupAsync());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const renderItem = ({ item, drag }) => {
    return (
      <DraggableItemWrapper>
        <ItemView>
          <TouchableOpacity onLongPress={drag}>
            <Icon name="drag-handle" size={20} />
          </TouchableOpacity>
          <StyledText>{item.GRP_NAME}</StyledText>
          <TouchableOpacity onPress={() => {props.navigation.navigate('EditGroupScreen',{
            groupIdx: item.GRP_IDX,
            groupName: item.GRP_NAME})}}>
            <Icon name="edit" size={20} />
          </TouchableOpacity>
        </ItemView>
        <ToggleSwitch navigation={props.navigation}
          onTrue={() => {
            setCount(count + 1);
            selectedList.current.push(item.GRP_IDX);
          }}
          onFalse={() => {
            setCount(count - 1);
            for (let i = 0; i < selectedList.current.length; i++) {
              if (i === item.GRP_IDX) {
                selectedList.current.splice(i, 1);
              }
            }
          }} />
      </DraggableItemWrapper>
    );
  };

  return <EditView onPressBackButton={onPressBackButton} onPressDeleteButton={onPressDeleteButton} isSelected={count > 0}>
    <DraggableFlatList
      data={targetList}
      renderItem={renderItem}
      onDragEnd={({ data }) => onDragEnd(data)}
      keyExtractor={(item) => `draggable-group-item-${item.GRP_IDX}`}
    />
  </EditView>;
};


export default EditGroupListScreen;
