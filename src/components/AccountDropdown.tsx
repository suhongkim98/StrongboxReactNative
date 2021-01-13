import React, {useEffect, useState} from 'react';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import {StrongboxDatabase} from '../StrongboxDatabase.ts';

interface AccountDropdownProps {
  setAccountFunc: (idx: number) => any;
  serviceIdx: number;
}

const AccountDropdown = ({
  setAccountFunc,
  serviceIdx,
}: AccountDropdownProps) => {
  const [dropdownList, setDropdownList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    const database = StrongboxDatabase.getInstance();
    database
      .getAccount(serviceIdx)
      .then((result) => {
        const list = result.filter((row) => {
          //Oauth계정 선택 못하게하기
          return row.OAUTH_SERVICE_NAME !== null;
        });
        const tmp = list.map((row) => (
          <DropdownItem
            key={row.SORT_ORDER}
            title={row.ACCOUNT_NAME}
            onPressItem={() => {
              setAccountName(row.ACCOUNT_NAME);
              setAccountFunc(row.IDX);
              setDropdownVisible(false);
            }}
          />
        ));
        setDropdownList(tmp);
      })
      .catch(() => {});
  }, [serviceIdx, setAccountFunc]);
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
