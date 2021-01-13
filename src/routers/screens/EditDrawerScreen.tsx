import React, {useState, useEffect} from 'react';
import EditView from '../../components/EditView';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useSelector, useDispatch} from 'react-redux';
import {Alert} from 'react-native';
import {updateGroup} from '../../modules/groupList';
import EditDrawerItem from '../../components/EditDrawerItem';
import {StrongboxDatabase} from '../../StrongboxDatabase.ts';
import {initEditDrawerRedux} from '../../modules/editDrawerRedux.ts';
import {deleteGroupByIdx} from '../../modules/groupList.ts';
import {deleteServiceByIdx} from '../../modules/serviceList.ts';
import {updateSelectedItemIndex} from '../../modules/selectedService.ts';
const EditDrawerScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [orderList, setOrderList] = useState([]);
  const groupList = useSelector((state: RootState) => state.groupList.list);
  const count = useSelector((state: RootState) => state.editDrawerRedux.count);
  const targetServiceList = useSelector(
    (state: RootState) => state.editDrawerRedux.selectedService,
  );
  const targetGroupList = useSelector(
    (state: RootState) => state.editDrawerRedux.selectedGroup,
  );
  const selectedService = useSelector(
    (state: RootState) => state.selectedService.itemIndex,
  );

  useEffect(() => {
    console.log('진입');
    const unsubscribe = navigation.addListener('blur', () => {
      //화면 이탈 시 발생 이벤트 초기화하자
      console.log('이탈');
      dispatch(initEditDrawerRedux()); // redux 초기화
    });

    return unsubscribe;
  }, [dispatch, navigation]);

  useEffect(() => {
    //그룹 순서 뽑기
    const tmp = [];
    for (let i = 0; i < groupList.length; i++) {
      const element = groupList[i];
      tmp.push(element.ORDER);
    }
    setOrderList(tmp);
  }, [groupList]);

  const renderItem = ({item, drag}) => {
    return (
      <EditDrawerItem
        onLongPress={drag}
        name={item.GRP_NAME}
        navigation={navigation}
        groupIdx={item.GRP_IDX}
      />
    );
  };
  const onDragEnd = (newData) => {
    //순서 변경 작업
    for (let i = 0; i < newData.length; i++) {
      newData[i].ORDER = orderList[i]; //순서 변경
    }
    const database = StrongboxDatabase.getInstance();
    for (let i = 0; i < newData.length; i++) {
      database.updateSortOrder(
        'GROUPS_TB',
        newData[i].GRP_IDX,
        newData[i].ORDER,
      );
    }
    dispatch(updateGroup(newData));
  };

  const onAgree = () => {
    const database = StrongboxDatabase.getInstance();
    if (targetServiceList.length > 0) {
      database.deleteService(targetServiceList);
      dispatch(deleteServiceByIdx(targetServiceList));

      for (let i = 0; i < targetServiceList.length; i++) {
        if (selectedService === targetServiceList[i]) {
          dispatch(updateSelectedItemIndex({idx: -1, name: 'no-name'})); // 선택서비스 초기화
        }
      }
    }
    if (targetGroupList.length > 0) {
      database.deleteGroup(targetGroupList);
      dispatch(deleteGroupByIdx(targetGroupList));
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
      <DraggableFlatList
        data={groupList}
        renderItem={renderItem}
        onDragEnd={({data}) => onDragEnd(data)}
        keyExtractor={(item) => `draggable-group-item-${item.GRP_IDX}`}
      />
    </EditView>
  );
};

export default EditDrawerScreen;
