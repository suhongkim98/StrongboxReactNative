import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import PlusSVG from '../images/PlusSVG';
import MinusSVG from '../images/MinusSVG';
import StyledText from './StyledText';
import {TouchableOpacity} from 'react-native';
import {updateSelectedItemIndex} from '../modules/selectedService';
import {useDispatch, useSelector} from 'react-redux';

interface GroupFolderProps {
  groupName: string;
  groupIdx: number;
  navigation: any;
}
const TotalWrapper = styled.View`
  width: 100%;
  flex-direction: column;
  margin-bottom: 5px;
`;
const HeaderWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
interface BodyProps {
  isClose: boolean;
}
const BodyWrapper = styled.View<BodyProps>`
  padding-left: 15px;
  overflow: hidden;
  ${({isClose}) => isClose && 'height: 0px;'};
`;
const BodyInnerWrapper = styled.View`
  overflow: visible;
`;
const IconView = styled.View``;

const GroupFolder = ({groupName, groupIdx, navigation}: GroupFolderProps) => {
  const [isClose, setClose] = useState(false);
  const dispatch = useDispatch();
  const serviceList = useSelector((state: RootState) => state.serviceList.list);
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    const tmp = [];
    serviceList.map((row) => {
      if (row.GRP_IDX === groupIdx) {
        tmp.push(row);
      }
    });
    setGroupItems(tmp);
  }, [groupIdx, serviceList]);

  const toggleFolder = () => {
    setClose(!isClose);
  };

  const printIcon = () => {
    if (groupItems.length <= 0) {
      return null;
    }
    if (isClose) {
      return <PlusSVG width="20px" height="20px" color="gray" />;
    }
    return <MinusSVG width="20px" height="20px" color="gray" />;
  };

  return (
    <TotalWrapper>
      <TouchableOpacity onPress={() => toggleFolder()}>
        <HeaderWrapper>
          <StyledText size="20px" color="gray">
            {groupName}
          </StyledText>
          <IconView>{printIcon()}</IconView>
        </HeaderWrapper>
      </TouchableOpacity>
      <BodyWrapper isClose={isClose}>
        <BodyInnerWrapper>
          {groupItems.map((row) => {
            return (
              <TouchableOpacity
                key={row.SERVICE_IDX}
                onPress={() => {
                  dispatch(
                    updateSelectedItemIndex({
                      idx: row.SERVICE_IDX,
                      name: row.SERVICE_NAME,
                    }),
                  );
                  navigation.jumpTo('MainScreen');
                }}>
                <StyledText size="20px" color="white">
                  {row.SERVICE_NAME}
                </StyledText>
              </TouchableOpacity>
            );
          })}
        </BodyInnerWrapper>
      </BodyWrapper>
    </TotalWrapper>
  );
};

export default GroupFolder;
