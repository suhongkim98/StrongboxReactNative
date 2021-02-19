import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import StyledText from '../components/StyledText';
import ToggleSwitch from '../components/ToggleSwitch';
import {pushGroup, popGroup} from '../modules/editDrawerRedux';
import {useDispatch, useSelector} from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {StrongboxDatabase} from '../StrongboxDatabase';
import {updateServiceAsync} from '../modules/serviceList';
import {pushService, popService} from '../modules/editDrawerRedux';
import {RootState} from '../modules/index';
const StyledIcon = styled(Icon)`
  font-size: 30px;
  height: 22px;
  color: black;
`;
const FolderIcon = styled(Icon)`
  font-size: 20px;
  height: 22px;
  color: black;
`;
const TotalWrapper = styled.View`
  flex-direction: column;
  border: solid gray 1px;
  background-color: white;
`;
const HeaderWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;
const RowItem = styled.View`
  flex-direction: row;
`;
const BodyWrapper = styled.View`
  width: 100%;
  padding: 20px 0 0 20px;
`;
const BodyItem = styled.View`
  height: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
interface EditDrawerItemProps {
  onLongPress: () => any;
  name: string;
  navigation: any;
  groupIdx: number;
}
const EditDrawerItem = ({
  onLongPress,
  name,
  navigation,
  groupIdx,
}: EditDrawerItemProps) => {
  const dispatch = useDispatch();
  const [targetList, setTargetList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const serviceList = useSelector((state: RootState) => state.serviceList.list);
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  useEffect(() => {
    console.log('진입');
    const unsubscribe = navigation.addListener('blur', () => {
      //화면 이탈 시 발생 이벤트 초기화하자
      console.log('이탈');
    });
    const services = serviceList.filter((row) => {
      return row.GRP_IDX === groupIdx;
    });
    setTargetList(services);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigation]);
  useEffect(() => {
    const services = serviceList.filter((row) => {
      return row.GRP_IDX === groupIdx;
    });
    const tmp = [];
    for (let i = 0; i < services.length; i++) {
      tmp.push(services[i].SORT_ORDER);
    }
    setOrderList(tmp);
  }, [serviceList, groupIdx]);

  const onFalseGroupToggle = () => {
    dispatch(popGroup(groupIdx));
  };
  const onTrueGroupToggle = () => {
    dispatch(pushGroup(groupIdx));
  };
  const renderItem = ({item, drag}) => {
    return (
      <BodyItem>
        <RowItem>
          <TouchableOpacity onLongPress={drag}>
            <StyledIcon name="drag-handle" />
          </TouchableOpacity>
          <StyledText>{item.SERVICE_NAME}</StyledText>
        </RowItem>
        <ToggleSwitch
          navigation={navigation}
          disabled={isGroupSelected}
          onFalse={() => {
            dispatch(popService(item.SERVICE_IDX));
          }}
          onTrue={() => {
            dispatch(pushService(item.SERVICE_IDX));
          }}
        />
      </BodyItem>
    );
  };
  const onDragEnd = (newData) => {
    const serviceIdx = [];
    //리스트 변화 시
    for (let i = 0; i < newData.length; i++) {
      serviceIdx.push(newData[i].SERVICE_IDX);
      newData[i].SORT_ORDER = orderList[i]; //순서 변경
    }
    setTargetList(newData);
    //DB업데이트
    const database = StrongboxDatabase.getInstance();
    database
      .updateSortOrder('SERVICES_TB', serviceIdx, orderList)
      .then(() => {
        dispatch(updateServiceAsync());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <TotalWrapper>
      <HeaderWrapper>
        <RowItem>
          <TouchableOpacity onLongPress={onLongPress}>
            <StyledIcon name="drag-handle" />
          </TouchableOpacity>
          <FolderIcon name="folder-open" />
          <StyledText size="18px" fontWeight="700">
            {name}
          </StyledText>
        </RowItem>
        <ToggleSwitch
          navigation={navigation}
          onFalse={onFalseGroupToggle}
          onTrue={onTrueGroupToggle}
          getToggleState={setIsGroupSelected}
        />
      </HeaderWrapper>
      <BodyWrapper>
        <DraggableFlatList
          data={targetList}
          renderItem={renderItem}
          onDragEnd={({data}) => onDragEnd(data)}
          keyExtractor={(item) => `draggable-service-item-${item.SERVICE_IDX}`}
        />
      </BodyWrapper>
    </TotalWrapper>
  );
};

export default EditDrawerItem;
