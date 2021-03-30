import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { StrongboxDatabase } from '../StrongboxDatabase';
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

interface ModalPopup {
    setAccountIdxFunc: (idx: any) => any;
    setAccountNameFunc: (name: any) => any;
    visibleFunc: (bool: boolean) => any;
    visible: boolean;
    selectService: number;
}
const SelectAccountModalPopup = ({setAccountIdxFunc,setAccountNameFunc,visibleFunc,visible,selectService}: ModalPopup) => {
    const [accountDropList, setAccountDropList] = useState([]);

    useEffect(() => {
        const onPressItem = (row: any) => {
          setAccountIdxFunc(row.IDX);
          setAccountNameFunc(row.ACCOUNT_NAME);
          visibleFunc(false);
        }
        const database = StrongboxDatabase.getInstance();
          database
          .getAccount(selectService)
          .then((result) => {
            const list = result.filter((row) => {
              //Oauth계정 선택 못하게하기
              return row.OAUTH_SERVICE_NAME === undefined;
            });
            setAccountDropList(list.map((row) => {
              return <SelectListItem 
                key={row.SORT_ORDER}
                onPress={() => {onPressItem(row)}}>
                  <StyledText>{row.ACCOUNT_NAME}</StyledText>
                </SelectListItem>;
              }));
          })
          .catch((error) => {
            console.log(error);
          });
      }, [selectService]);
      
    return <ModalPopup
        containerWidth="300px"
        containerHeight="300px"
        headerTitle="계정 선택"
        onBackdropPress={() => { visibleFunc(false) }}
        onDeny={() => { visibleFunc(false) }}
        onDenyTitle="취소"
        isVisible={visible}>
        <ScrollView>{accountDropList}</ScrollView>
    </ModalPopup>;
}

export default SelectAccountModalPopup;