import React, {useEffect, useState} from 'react';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import {useSelector} from 'react-redux';
import { RootState } from '../modules';

interface ServiceDropdownProps {
  setServiceFunc: (idx: number) => any;
}

const ServiceDropdown = ({setServiceFunc}: ServiceDropdownProps) => {
  const serviceList = useSelector((state: RootState) => state.serviceList.list);
  const [dropdownList, setDropdownList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    const tmp = serviceList.map((row) => (
      <DropdownItem
        key={row.SERVICE_IDX}
        title={row.SERVICE_NAME}
        onPressItem={() => {
          setServiceName(row.SERVICE_NAME);
          setServiceFunc(row.SERVICE_IDX);
          setDropdownVisible(false);
        }}
      />
    ));
    setDropdownList(tmp);
  }, [serviceList, setServiceFunc]);
  return (
    <Dropdown
      width="100%"
      list={dropdownList}
      selectedName={serviceName}
      visibleFunc={setDropdownVisible}
      visible={dropdownVisible}
    />
  );
};

export default ServiceDropdown;
