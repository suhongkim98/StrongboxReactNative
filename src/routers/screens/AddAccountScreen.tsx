import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Switch, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StackScreenContainer from '../../components/StackScreenContainer';
import { updateAccountAsync } from '../../modules/accountList';
import { StrongboxDatabase } from '../../StrongboxDatabase';
import Toast from 'react-native-root-toast';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import ModalPopup from '../../components/ModalPopup';
import { RootState } from '../../modules';

const AddTextInput = styled.TextInput`
  border-width: 1px;
  height: 30px;
  padding: 0 10px 0 10px;
  border-color: gray;
  border-radius: 3px;
  background-color: #f3f3f3;
`;
const BodyWrapper = styled.View`
  flex: 1;
  padding: 0 20px 0 20px;
`;
const OauthView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
`;
const OauthWrapper = styled.View`
  margin-bottom: 30px;
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
const SelectTouchable = styled.TouchableOpacity`
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
const AddAccountScreen = (props: any) => {
    const {serviceIdx} = props.route.params;
    const serviceList = useSelector((state: RootState) => state.serviceList.list);
    const titleValue = useRef('');
    const accountValue = useRef('');
    const passwordValue = useRef('');
    const [isOauthMode, setOauthMode] = useState(false);
    const [selectedDropboxService, setSelectedDropboxService] = useState(-1);
    const [selectedAccount, setSelectedAccount] = useState(-1);
    const [selectedDropboxServiceName, setSelectedDropboxServiceName] = useState('선택');
    const [selectedDropboxAccountName, setSelectedDropboxAccountName] = useState('선택');
    const [selectServiceModalVisible, setSelectServiceModalVisible] = useState(false);
    const [selectAccountModalVisible, setSelectAccountModalVisible] = useState(false);
    const dispatch = useDispatch();

    const [toastVisible, setToastVisible] = useState(false);
    const toastTimer: any = useRef<number>(-1);
    const [toastMessage, setToastMessage] = useState('');
    
    const [accountDropList, setAccountDropList] = useState([]);
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

    useEffect(() => {
      const onPressItem = (row: any) => {
        setSelectedAccount(row.IDX);
        setSelectedDropboxAccountName(row.ACCOUNT_NAME);
        setSelectAccountModalVisible(false);
      }
      const database = StrongboxDatabase.getInstance();
        database
        .getAccount(selectedDropboxService)
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
    }, [selectedDropboxService]);
    
  const onPressAddButton = () => {
    if (titleValue.current === '') {
      Alert.alert('타이틀을 입력해야 합니다.', '다시 입력해주세요', [
        {
          text: '확인',
          onPress: () => {},
        },
      ]);
      return;
    }
    if (isOauthMode) {
      if (selectedAccount === -1) {
        Alert.alert('계정 선택을 해주세요', '다시 선택해주세요', [
          {
            text: '확인',
            onPress: () => {},
          },
        ]);
        return;
      }
    } else if (accountValue.current === '' || passwordValue.current === '') {
      Alert.alert(
        '아이디 혹은 비밀번호를 입력하지 않았습니다.',
        '다시 입력해주세요',
        [
          {
            text: '확인',
            onPress: () => {},
          },
        ],
      );
      return;
    }
    const database = StrongboxDatabase.getInstance();
    if (isOauthMode) {
      database
        .isExistOauthAccountName(
          titleValue.current,
          serviceIdx,
          selectedAccount,
        )
        .then((result) => {
          if (result > 0) {
            showToastMessage('이미 존재하는 계정입니다.');
          } else {
            database
              .addAccount({
                accountName: titleValue.current,
                serviceIDX: serviceIdx,
                OAuthAccountIDX: selectedAccount,
              })
              .then(() => {
                //메인스크린 계정 업데이트 함수 redux 건들기
                dispatch(updateAccountAsync(serviceIdx));
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      database
        .isExistAccountName(titleValue.current, serviceIdx)
        .then((result) => {
          if (result > 0) {
            showToastMessage('이미 존재하는 계정입니다.');
          } else {
            database
              .addAccount({
                accountName: titleValue.current,
                serviceIDX: serviceIdx,
                id: accountValue.current,
                password: passwordValue.current,
              })
              .then(() => {
                //메인스크린 계정 업데이트 함수 redux 건들기
                dispatch(updateAccountAsync(serviceIdx));
                showToastMessage('계정을 추가했습니다');
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
    onPressBackButton(); //나가기
  };
  const onOauthSwitchChange = () => {
    accountValue.current = '';
    passwordValue.current = '';
    setSelectedDropboxService(-1);
    setSelectedAccount(-1);
    setOauthMode(!isOauthMode);
  };
  const onPressSelectAccountButton = () => {
    if(selectedDropboxService > 0) {
      setSelectAccountModalVisible(true);
    } else {
      showToastMessage('서비스 선택을 먼저 해주세요');
    }
  }
  const printServiceList = () => {
    const onPressItem = (row: any) => {
      setSelectedDropboxServiceName(row.SERVICE_NAME);
      setSelectedDropboxService(row.SERVICE_IDX);
      setSelectServiceModalVisible(false);
    }
    const list = serviceList.map((row: any) => {
      return <SelectListItem onPress={() => {onPressItem(row)}} key={row.SERVICE_IDX}>
          <StyledText>{row.SERVICE_NAME}</StyledText>
        </SelectListItem>;
    });
    return list;
  }
    return (<StackScreenContainer 
        screenName="계정 추가"
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
        headerTitle="서비스 선택"
        onBackdropPress={() => {setSelectServiceModalVisible(false)}}
        onDeny={() => {setSelectServiceModalVisible(false)}}
        onDenyTitle="취소"
        isVisible={selectServiceModalVisible}>
          <ScrollView>
            {printServiceList()}
          </ScrollView>
      </ModalPopup>
      <ModalPopup
        containerWidth="300px"
        containerHeight="300px"
        headerTitle="계정 선택"
        onBackdropPress={() => {setSelectAccountModalVisible(false)}}
        onDeny={() => {setSelectAccountModalVisible(false)}}
        onDenyTitle="취소"
        isVisible={selectAccountModalVisible}>
          <ScrollView>{accountDropList}</ScrollView>
      </ModalPopup>
      <BodyWrapper>
        <OauthWrapper>
          <OauthView>
            <StyledText>SNS 연동 로그인 등록하기</StyledText>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isOauthMode ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => onOauthSwitchChange()}
              value={isOauthMode}
            />
          </OauthView>
          {isOauthMode ? (
            <View>
              <View>
                <StyledText fontWeight="700">서비스 선택</StyledText>
                <SelectTouchable onPress={() => {setSelectServiceModalVisible(true)}}>
                  <StyledText>{selectedDropboxServiceName}</StyledText>
                  <Arrow />
                </SelectTouchable>
              </View>
              <View>
                <StyledText fontWeight="700">계정 선택</StyledText>
                <SelectTouchable onPress={() => {onPressSelectAccountButton()}}>
                  <StyledText>{selectedDropboxAccountName}</StyledText>
                  <Arrow />
                </SelectTouchable>
              </View>
            </View>
          ) : (
            <View>
              <View>
                <StyledText fontWeight="700">아이디 입력</StyledText>
                <AddTextInput
                  onChangeText={(text) => {
                    accountValue.current = text;
                  }}
                  placeholder="입력"
                />
              </View>
              <View>
                <StyledText fontWeight="700">비밀번호 입력</StyledText>
                <AddTextInput
                  onChangeText={(text) => {
                    passwordValue.current = text;
                  }}
                  placeholder="입력"
                />
              </View>
            </View>
          )}
        </OauthWrapper>
        <View>
          <StyledText fontWeight="700">계정 이름 입력</StyledText>
          <AddTextInput
            onChangeText={(text) => {
              titleValue.current = text;
            }}
            placeholder="입력"
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

export default AddAccountScreen;
