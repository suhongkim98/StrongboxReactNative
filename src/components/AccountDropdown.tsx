import React, {useEffect, useState} from 'react';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import {useSelector} from 'react-redux';

interface AccountDropdownProps {
  setAccountFunc: (idx: number) => any;
  serviceIdx: number;
}

const AccountDropdown = ({
  setAccountFunc,
  serviceIdx,
}: AccountDropdownProps) => {
  const accountList = useSelector((state: RootState) => state.accountList.list);
  const [dropdownList, setDropdownList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    const list = accountList.filter((row) => {
      return row.SERVICE_IDX === serviceIdx && row.OAUTH_LOGIN_IDX === null; // Oauth계정 선택 못하게
    });
    const tmp = list.map((row) => (
      <DropdownItem
        key={row.ACCOUNT_IDX}
        title={row.ACCOUNT_NAME}
        onPressItem={() => {
          setAccountName(row.ACCOUNT_NAME);
          setAccountFunc(row.ACCOUNT_IDX);
          setDropdownVisible(false);
        }}
      />
    ));
    setDropdownList(tmp);
  }, [accountList, serviceIdx, setAccountFunc]);
  return (
    <Dropdown
      width="100%"
      list={dropdownList}
      selectedName={accountName}
      visibleFunc={setDropdownVisible}
      visible={dropdownVisible}
    />
  );
};

export default AccountDropdown;
