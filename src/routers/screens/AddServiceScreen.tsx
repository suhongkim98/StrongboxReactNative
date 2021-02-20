import React, { useRef, useState } from 'react';
import StackScreenContainer from '../../components/StackScreenContainer';
import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, ScrollView, View } from 'react-native';
import { StrongboxDatabase } from '../../StrongboxDatabase';
import { updateServiceAsync } from '../../modules/serviceList';
import ModalPopup from '../../components/ModalPopup';
import { RootState } from '../../modules';

const BodyWrapper = styled.View`
  flex: 1;
  padding: 0 20px 0 20px;
`;

const FooterWrapper = styled.View`
  height: 80px;
  justify-content: center;
  align-items: center;
  padding: 0 20px 0 20px;
`;
const AddButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid gray;
`;

const ServiceTextInput = styled.TextInput`
  border-width: 1px;
  height: 30px;
  padding: 0 10px 0 10px;
  border-color: gray;
  border-radius: 3px;
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
const GroupListItem = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-bottom-width: 1px;
  border-color: gray;
  border-style: solid;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const AddServiceScreen = (props: any) => {

  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer: any = useRef<number>(-1);
  const [toastMessage, setToastMessage] = useState('');
  const addServiceTextValue = useRef('');
  const [groupIdx, setGroupIdx] = useState(-1);
  const [selectGroupName, setSelectGroupName] = useState('선택');
  const dispatch = useDispatch();
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const groupList = useSelector((state: RootState) => state.groupList.list);

  const initInputValue = () => {
    addServiceTextValue.current = '';
    setGroupIdx(-1);
    setSelectGroupName('선택');
  };
    
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

    const onPressBackButton = () => {
        props.navigation.goBack();
    }
    const onPressAddButton = () => {
      if (groupIdx < 0) {
        Alert.alert('그룹 선택을 해주셔야 합니다.', '다시 입력해주세요', [
          {
            text: '확인',
            onPress: () => {},
          },
        ]);
        return;
      }
      if (addServiceTextValue.current === '') {
        Alert.alert('이름을 입력해야 합니다.', '다시 입력해주세요', [
          {
            text: '확인',
            onPress: () => {},
          },
        ]);
        return;
      }
      const database = StrongboxDatabase.getInstance();
      database
        .isExistServiceName(addServiceTextValue.current, groupIdx)
        .then((result) => {
          if (result > 0) {
            //알림Toast 추가하기
            showToastMessage('이미 존재하는 서비스 이름입니다.');
            initInputValue();
          } else {
            database // grp-idx, service이름 매개변수로
              .addService(groupIdx, addServiceTextValue.current)
              .then(() => {
                //redux 건들기
                dispatch(updateServiceAsync());
                initInputValue();
                onPressBackButton();
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });

    }
    const printGroupList = () => {
      const onPressItem = (row: any) => {
        setGroupIdx(row.GRP_IDX);
        setAddGroupModalVisible(false);
        setSelectGroupName(row.GRP_NAME);
      }
      const list = groupList.map((row: any) => {
        return <GroupListItem key={row.GRP_IDX} onPress={() => {onPressItem(row)}}><StyledText>{row.GRP_NAME}</StyledText></GroupListItem>;
      });
      return list;
    }

    return (<StackScreenContainer 
        screenName="서비스 추가"
        onPressBackButton={onPressBackButton}>
      <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}>
        {toastMessage}
      </Toast>
      <ModalPopup
        containerWidth="300px"
        containerHeight="300px"
        headerTitle="그룹 선택"
        onBackdropPress={() => setAddGroupModalVisible(false)}
        isVisible={addGroupModalVisible}
        onDeny={() => setAddGroupModalVisible(false)}
        onDenyTitle="취소"
        >
          <ScrollView>
            {printGroupList()}
          </ScrollView>
      </ModalPopup>
      <BodyWrapper>
          <View>
            <StyledText>그룹 선택</StyledText>
            <SelectGroupTouchable onPress={() => setAddGroupModalVisible(true)}>
              <StyledText>{selectGroupName}</StyledText>
              <Arrow />
            </SelectGroupTouchable>
          </View>
          <View>
            <StyledText>서비스 이름</StyledText>
            <ServiceTextInput
              onChangeText={(text) => {
                addServiceTextValue.current = text;
              }}
              placeholder="이름을 입력해주세요"
            />
          </View>
      </BodyWrapper>
      <FooterWrapper>
        <AddButton
          onPress={() => {
            onPressAddButton();
          }}>
          <StyledText color="black" fontWeight="700">
            추가
          </StyledText>
        </AddButton>
      </FooterWrapper>
    </StackScreenContainer>);
}

export default AddServiceScreen;
