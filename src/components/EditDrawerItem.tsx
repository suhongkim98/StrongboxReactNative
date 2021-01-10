import React from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import StyledText from '../components/StyledText';
import ToggleSwitch from '../components/ToggleSwitch';
import {pushGroup, popGroup} from '../modules/editDrawerRedux.ts';
import {useDispatch} from 'react-redux';
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
  flex-direction: row;
  height: 100px;
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
const HeaderItem = styled.View`
  flex-direction: row;
`;
const BodyWrapper = styled.View``;

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
  const onFalseCalled = () => {
    dispatch(popGroup(groupIdx));
  };
  const onTrueCalled = () => {
    dispatch(pushGroup(groupIdx));
  };
  return (
    <TotalWrapper>
      <HeaderWrapper>
        <HeaderItem>
          <TouchableOpacity onLongPress={onLongPress}>
            <StyledIcon name="drag-handle" />
          </TouchableOpacity>
          <FolderIcon name="folder-open" />
          <StyledText size="18px" fontWeight="700">
            {name}
          </StyledText>
        </HeaderItem>
        <ToggleSwitch
          navigation={navigation}
          onFalse={onFalseCalled}
          onTrue={onTrueCalled}
        />
      </HeaderWrapper>
      <BodyWrapper />
    </TotalWrapper>
  );
};

export default EditDrawerItem;
