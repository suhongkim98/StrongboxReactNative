import React, {useEffect, useState} from 'react';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import {useSelector} from 'react-redux';
import { RootState } from '../modules';

interface GroupDropdownProps {
  setGroupFunc: (idx: number) => any;
}

const GroupDropdown = ({setGroupFunc}: GroupDropdownProps) => {
  const groupList = useSelector((state: RootState) => state.groupList.list);
  const [dropdownList, setDropdownList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    const tmp = groupList.map((row) => (
      <DropdownItem
        key={row.GRP_IDX}
        title={row.GRP_NAME}
        onPressItem={() => {
          setGroupName(row.GRP_NAME);
          setGroupFunc(row.GRP_IDX);
          setDropdownVisible(false);
        }}
      />
    ));
    setDropdownList(tmp);
  }, [groupList, setGroupFunc]);
  return (
    <Dropdown
      width="100%"
      list={dropdownList}
      selectedName={groupName}
      visibleFunc={setDropdownVisible}
      visible={dropdownVisible}
    />
  );
};

export default GroupDropdown;
