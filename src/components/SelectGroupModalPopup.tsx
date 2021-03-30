import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { RootState } from '../modules';
import ModalPopup from './ModalPopup';
import StyledText from './StyledText';



const GroupListItem = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-bottom-width: 1px;
  border-color: gray;
  border-style: solid;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface ModalProps {
    visibleFunc: (bool: boolean) => any;
    visible: boolean;
    setGroupIdxFunc: (idx: any) => any;
    setGroupNameFunc: (name: any) => any;
}

const SelectGroupModalPopup = ({visibleFunc, visible, setGroupIdxFunc, setGroupNameFunc}: ModalProps) => {
    const groupList = useSelector((state: RootState) => state.groupList.list);

    const printGroupList = () => {
        const onPressItem = (row: any) => {
          setGroupIdxFunc(row.GRP_IDX);
          visibleFunc(false);
          setGroupNameFunc(row.GRP_NAME);
        }
        const list = groupList.map((row: any) => {
          return <GroupListItem key={row.GRP_IDX} onPress={() => {onPressItem(row)}}><StyledText>{row.GRP_NAME}</StyledText></GroupListItem>;
        });
        return list;
      }

    return <ModalPopup
    containerWidth="300px"
    containerHeight="300px"
    headerTitle="그룹 선택"
    onBackdropPress={() => visibleFunc(false)}
    isVisible={visible}
    onDeny={() => visibleFunc(false)}
    onDenyTitle="취소"
    >
      <ScrollView>
        {printGroupList()}
      </ScrollView>
  </ModalPopup>;
}

export default SelectGroupModalPopup;