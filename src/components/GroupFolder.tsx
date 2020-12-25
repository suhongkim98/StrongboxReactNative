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
  height: string;
  isClose: boolean;
}
const BodyWrapper = styled.View<BodyProps>`
  padding-left: 15px;
  overflow: hidden;
  height: ${(props) => props.height + 'px'};
`;
const BodyInnerWrapper = styled.View`
  overflow: visible;
`;

const GroupFolder = ({groupName, groupIdx, navigation}: GroupFolderProps) => {
  const [isClose, setClose] = useState(false);
  const [innerBodyHeight, setInnerBodyHeight] = useState(0);
  const dispatch = useDispatch();
  const serviceList = useSelector((state: RootState) => state.serviceList.list);
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    if (isClose) {
      setInnerBodyHeight(0);
    } else {
      setInnerBodyHeight(27 * groupItems.length);
    }
  }, [groupItems.length, isClose]);

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

  return (
    <TotalWrapper>
      <TouchableOpacity onPress={() => toggleFolder()}>
        <HeaderWrapper>
          <StyledText size="20px" color="gray">
            {groupName}
          </StyledText>
          {isClose ? (
            <PlusSVG width="20px" height="20px" color="gray" />
          ) : (
            <MinusSVG width="20px" height="20px" color="gray" />
          )}
        </HeaderWrapper>
      </TouchableOpacity>
      <BodyWrapper height={innerBodyHeight} isClose={isClose}>
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
