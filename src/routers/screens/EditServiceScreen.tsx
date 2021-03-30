import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import ModalPopup from '../../components/ModalPopup';
import SelectGroupModalPopup from '../../components/SelectGroupModalPopup';
import StackScreenContainer from '../../components/StackScreenContainer';
import StyledText from '../../components/StyledText';
import { RootState } from '../../modules';
import { updateServiceAsync } from '../../modules/serviceList';
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
const InputBox = styled.TextInput`
  border-style: solid;
  border-color: gray;
  border-bottom-width: 1px;
  margin: 10px 0 0 0;
  padding: 0 10px 0 10px;

  width: 100%;
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

const EditServiceScreen = (props: any) => {
    const { groupIdx, serviceIdx, serviceName } = props.route.params;
    const [serviceText, setServiceText] = useState('');
    const [groupModalVisible, setGroupModalVisible] = useState(false);

    const [selectGroupIdx, setSelectGroupIdx] = useState(-1);
    const [selectGroupName, setSelectGroupName] = useState('변경 원할 시 선택');
    
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

    const onPressSave = () => {
        //그룹 변경 시 해당 그룹idx로, 그룹 변경 안 했으면 기존 idx를 집어넣고
        let targetGroupIdx;
        const db = StrongboxDatabase.getInstance();
        if (selectGroupIdx >= 0) {
            targetGroupIdx = selectGroupIdx;
        } else {
            targetGroupIdx = groupIdx;
        }
        if (serviceText !== '' && serviceText != null) {
            //이름도 같이 변경
            db.changeServiceName(serviceIdx, targetGroupIdx, serviceText).then((result) => {
                if (result === true) {
                    showToastMessage("변경 완료하였습니다.");
                    dispatch(updateServiceAsync());
                } else {
                    showToastMessage("이미 해당 그룹에 존재하는 이름입니다.");
                }
            });
        } else {
            // 그룹만 변경
            db.changeServiceName(serviceIdx, targetGroupIdx, serviceName).then((result) => {
                if (result === true) {
                    showToastMessage("변경 완료하였습니다.");
                    dispatch(updateServiceAsync());
                } else {
                    showToastMessage("이미 해당 그룹에 존재하는 이름입니다.");
                }
            });
        }
    };
    return <StackScreenContainer screenName="서비스 수정" onPressBackButton={() => { props.navigation.goBack(); }}>
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
        <TotalWrapper>
            <InnerWrapper>
                <StyledText>그룹 변경</StyledText>
                <SelectGroupTouchable onPress={() => setGroupModalVisible(true)}>
                    <StyledText>{selectGroupName}</StyledText>
                    <Arrow />
                </SelectGroupTouchable>
                <StyledText>서비스 이름 변경</StyledText>
                <InputBox placeholder={serviceName} onChangeText={(text) => setServiceText(text)} />
            </InnerWrapper>
            <SaveButton onPress={onPressSave}><StyledText fontWeight="700">저장</StyledText></SaveButton>
        </TotalWrapper>
    </StackScreenContainer>;
};

export default EditServiceScreen;
