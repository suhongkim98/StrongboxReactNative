import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import StackScreenContainer from '../../components/StackScreenContainer';
import Icon from 'react-native-vector-icons/AntDesign';
import StyledText from '../../components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import { updateSelectedItemIndex } from '../../modules/selectedService';

const SearchInput = styled.TextInput`
   height: 100%;
   width: 90%;
`;
const SearchBar = styled.View`
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 10px;
  background-color: white;
  border-radius: 5px;
  border: solid 1px gray;

  margin: 10px 0 10px 0;
`;
const BodyWrapper = styled.View`
  border-top-width: 1px;
  border-style: solid;
  border-color: gray;
  flex: 1;
`;
const SearchItem = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-style: solid;
  border-color: gray;

  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const SearchServiceScreen = (props: any) => {
    const [text, setText] = useState();
    const serviceList: any = useSelector((state: RootState) => state.serviceList.list);
    const groupList: any = useSelector((state: RootState) => state.groupList.list);
    const [items, setItems] = useState();
    const dispatch = useDispatch();

    const onPressBackButton = () => {
        props.navigation.popToTop();
    }
    useEffect(() => {
        for(let i = 0 ; i < serviceList.length ; i++) {
            for(let j = 0 ; j < groupList.length ; j++) {
                if(groupList[j].GRP_IDX === serviceList[i].GRP_IDX) {
                    serviceList[i]['GRP_NAME'] = groupList[j].GRP_NAME;
                } 
            }
        }
    },[]);
    useEffect(() => {
        //업데이트
        const services = serviceList.filter((row: any) => {
            return row.SERVICE_NAME.indexOf(text) > -1;
        });
        const list = services.map((row: any) => {
            return <SearchItem onPress={() => {
                dispatch(
                  updateSelectedItemIndex({
                    idx: row.SERVICE_IDX,
                    name: row.SERVICE_NAME,
                  }),
                );
                onPressBackButton();
                props.navigation.navigate('MainScreen');
              }}>
                <StyledText fontWeight="700">{row.GRP_NAME} - </StyledText>
                <StyledText>{row.SERVICE_NAME}</StyledText>
            </SearchItem>;
        });
        if(text !== "") {
            setItems(list);
        } else {
            setItems(null);
        }
    },[text]);
    return <StackScreenContainer screenName="검색" onPressBackButton={onPressBackButton}>
        <SearchBar>
            <SearchInput 
            autoFocus
            placeholder="검색..."
            onChangeText={(text: any) => setText(text)}/>
            <Icon color="black" name="search1"></Icon>
        </SearchBar>
        <BodyWrapper>
            <ScrollView>
                {items}
            </ScrollView>
        </BodyWrapper>
    </StackScreenContainer>
}

export default SearchServiceScreen;