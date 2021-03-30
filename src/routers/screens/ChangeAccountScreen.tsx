import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import SelectGroupModalPopup from '../../components/SelectGroupModalPopup';
import SelectServiceModalPopup from '../../components/SelectServiceModalPopup';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import { RootState } from '../../modules';
import { updateAccountAsync } from '../../modules/accountList';
import { StrongboxDatabase } from '../../StrongboxDatabase';

const TotalWrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  margin: 20px 0 20px 0;
`;
const InnerWrapper = styled.View``;
const SaveButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 40px;
`;
const SelectGroupTouchable = styled.TouchableOpacity`
  width: 100%;
  height: 30px;
  border: 1px solid gray;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 10px 0 10px;
`;
const Arrow = styled.View`
  width: 10px;
  height: 10px;
  border-top-width: 1px;
  border-right-width: 1px;
  transform: rotate(135deg); /* 각도 */
  border-color: gray;
`;
const InputBox = styled.TextInput`
  border-style: solid;
  border-color: gray;
  border-bottom-width: 1px;
  margin: 10px 0 0 0;
  padding: 0 10px 0 10px;

  width: 100%;
`;
const Item = styled.View`
  margin: 0 0 10px 0;
`;

const ChangeAccountScreen = (props: any) => {
    const { accountIdx, accountName, oauthServiceName } = props.route.params;
    const accountList = useSelector((state: RootState) => state.accountList.list);
    const selectedService = useSelector((state:RootState) => state.selectedService.itemIndex);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [groupModalVisible, setGroupModalVisible] = useState(false);
    const [selectGroupName, setSelectGroupName] = useState('n');
    const [selectServiceName, setSelectServiceName] = useState('n');
    const [selectGroupIdx, setSelectGroupIdx] = useState(-1);
    const [selectServiceIdx, setSelectServiceIdx] = useState(-1);
    const [inputId, setInputId] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputAccountName, setInputAccountName] = useState('');
    const dispatch = useDispatch();

    const [toastVisible, setToastVisible] = useState(false);
    const toastTimer: any = useRef<number>(-1);
    const [toastMessage, setToastMessage] = useState('');

    const showToastMessage = (message: string) => {
        // toast 보여주는 함수
        setToastMessage(message);
        setToastVisible(true);
        if (toastTimer.current !== -1) {
            clearTimeout(toastTimer.current);
            toastTimer.current = -1;
        }
        toastTimer.current = setTimeout(() => {
            setToastVisible(false);
        }, 2000);
    };

    useEffect(() => {
        const db = StrongboxDatabase.getInstance();
        db.getAccountInfo(accountIdx, oauthServiceName != null).then((result) => {
            setSelectGroupName(result.groupName);
            setSelectServiceName(result.serviceName);
            setSelectGroupIdx(result.groupIdx);
            setSelectServiceIdx(result.serviceIdx);
            setInputAccountName(accountName);
        }).catch((error) => {
            console.error(error);
        });
        if(oauthServiceName == null) {
            for(let i = 0 ; i < accountList.length ; i++) {
                if(accountList[i].IDX === accountIdx) {
                    setInputId(accountList[i].ID);
                    setInputPassword(accountList[i].PASSWORD);
                    break;
                }
            }
        }
    }, []);
    const onPressSave = () => {
        if(selectServiceIdx < 0) {
            showToastMessage("서비스 선택을 해주세요");
            return;
        }
        const db = StrongboxDatabase.getInstance();
        
        if(oauthServiceName) {
            //oauth
            db.changeAccountInfo(accountIdx, oauthServiceName != null, selectServiceIdx, inputAccountName).then((result) => {
                if(result) {
                    showToastMessage("변경 성공하였습니다.");
                    dispatch(updateAccountAsync(selectedService.idx));  
                    props.navigation.goBack();       
                } else {
                    showToastMessage("이미 해당 서비스에 존재하는 계정 이름입니다.");
                }
            }).catch((error) => {console.error(error);});
        } else {
            db.changeAccountInfo(accountIdx, oauthServiceName != null, selectServiceIdx, inputAccountName,inputId,inputPassword).then((result) => {
                if(result) {
                    showToastMessage("변경 성공하였습니다.");
                    dispatch(updateAccountAsync(selectedService.idx));  
                    props.navigation.goBack();       
                } else {
                    showToastMessage("이미 해당 서비스에 존재하는 계정 이름입니다.");
                }
            }).catch((error) => {console.error(error);});
        }
    }
    const onPressSelectGroupButton = () => {
        setSelectServiceIdx(-1);
        setSelectServiceName('');
        setGroupModalVisible(true);
    }
    const onPressSelectServiceButton = () => {
        if(selectGroupIdx > 0) {
            setServiceModalVisible(true);
        } else {
            showToastMessage("그룹 먼저 선택해주세요");
        }
    }
    return <StackScreenContainer
        onPressBackButton={() => { props.navigation.goBack(); }}
        screenName="계정 편집"
    >
        <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}>
        {toastMessage}
      </Toast>
        <SelectGroupModalPopup 
            visibleFunc={setGroupModalVisible}
            visible={groupModalVisible}
            setGroupIdxFunc={setSelectGroupIdx}
            setGroupNameFunc={setSelectGroupName}
        />
        <SelectServiceModalPopup 
            visibleFunc={setServiceModalVisible}
            visible={serviceModalVisible}
            setServiceIdxFunc={setSelectServiceIdx}
            setServiceNameFunc={setSelectServiceName}
            groupIdx={selectGroupIdx}
        />
        <TotalWrapper>
            <InnerWrapper>
                <Item>
                <StyledText>그룹 선택</StyledText>
                <SelectGroupTouchable onPress={() => onPressSelectGroupButton()}>
                    <StyledText>{selectGroupName}</StyledText>
                    <Arrow />
                </SelectGroupTouchable>
                </Item>
                <Item>
                <StyledText>서비스 변경</StyledText>
                <SelectGroupTouchable onPress={() => onPressSelectServiceButton()}>
                    <StyledText>{selectServiceName}</StyledText>
                    <Arrow />
                </SelectGroupTouchable>
                </Item>
                <Item>
                <StyledText>별명</StyledText>
                <InputBox placeholder={inputAccountName} onChangeText={(text)=>setInputAccountName(text)} />
                </Item>
                <Item>
                {
                    oauthServiceName == null && <View>
                    <StyledText>아이디</StyledText>
                    <InputBox placeholder={inputId} onChangeText={(text)=>setInputId(text)} />
                    <StyledText>패스워드</StyledText>
                    <InputBox placeholder={inputPassword} onChangeText={(text)=>setInputPassword(text)} />
                </View>
                }
                </Item>
            </InnerWrapper>
            <SaveButton onPress={onPressSave}><StyledText fontWeight="700">저장</StyledText></SaveButton>
        </TotalWrapper>
    </StackScreenContainer>;
}

export default ChangeAccountScreen;