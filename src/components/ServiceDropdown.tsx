import React, {useEffect, useState} from 'react';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import {useSelector} from 'react-redux';

interface ServiceDropdownProps {
  setServiceFunc: (idx: number) => any;
  setServiceNameFunc: (name: string) => string;
}

const ServiceDropdown = ({
  setServiceFunc,
  setServiceNameFunc,
}: ServiceDropdownProps) => {
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
          setServiceNameFunc(row.SERVICE_NAME);
          setDropdownVisible(false);
        }}
      />
    ));
    setDropdownList(tmp);
  }, [serviceList, setServiceFunc, setServiceNameFunc]);
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
