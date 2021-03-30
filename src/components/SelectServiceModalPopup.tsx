import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { RootState } from '../modules';
import ModalPopup from './ModalPopup';
import StyledText from './StyledText';

const SelectListItem = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-bottom-width: 1px;
  border-color: gray;
  border-style: solid;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface ModalProp {
    setServiceNameFunc: (name: any) => any;
    setServiceIdxFunc: (idx: any) => any;
    visibleFunc: (bool: boolean) => any;
    visible: boolean;
    groupIdx ?: number; // 받으면 해당 그룹 서비스만, 안 받으면 전체 서비스 리스트
}
const SelectServiceModalPopup = ({setServiceNameFunc,setServiceIdxFunc,visibleFunc,visible,groupIdx}: ModalProp) => {
    const serviceList = useSelector((state: RootState) => state.serviceList.list);

    const printServiceList = () => {
        const onPressItem = (row: any) => {
          setServiceNameFunc(row.SERVICE_NAME);
          setServiceIdxFunc(row.SERVICE_IDX);
          visibleFunc(false);
        }
        let target: any;
        if(groupIdx) {
            target = serviceList.filter((row) => {return row.GRP_IDX === groupIdx;});
        } else {
            target = serviceList;
        }
        const list = target.map((row: any) => {    
          return <SelectListItem onPress={() => {onPressItem(row)}} key={row.SERVICE_IDX}>
              <StyledText>{row.SERVICE_NAME}</StyledText>
            </SelectListItem>;
        });
        return list;
    }
    return <ModalPopup
    containerWidth="300px"
    containerHeight="300px"
    headerTitle="서비스 선택"
    onBackdropPress={() => {visibleFunc(false)}}
    onDeny={() => {visibleFunc(false)}}
    onDenyTitle="취소"
    isVisible={visible}>
      <ScrollView>
        {printServiceList()}
      </ScrollView>
  </ModalPopup>;
}

export default SelectServiceModalPopup;