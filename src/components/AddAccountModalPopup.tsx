import React, {useRef, useState} from 'react';
import ModalPopup from './ModalPopup';
import {StrongboxDatabase} from '../StrongboxDatabase';
import styled from 'styled-components/native';
import {Alert, Switch, View} from 'react-native';
import StyledText from './StyledText';
import ServiceDropdown from './ServiceDropdown';
import AccountDropdown from './AccountDropdown';
interface AddAccountModalPopupProps {
  visible: boolean;
  visibleFunc: (visible: boolean) => any;
  selectedServiceIDX: number;
}
const AddTextInput = styled.TextInput`
  border-width: 1px;
  height: 30px;
  padding: 0 10px 0 10px;
  border-color: gray;
  border-radius: 3px;
  background-color: #f3f3f3;
`;
const BodyWrapper = styled.View`
  width: 100%;
  height: 100%;
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

const AddAccountModalPopup = ({
  visible,
  visibleFunc,
  selectedServiceIDX,
}: AddAccountModalPopupProps) => {
  const titleValue = useRef('');
  const accountValue = useRef('');
  const passwordValue = useRef('');
  const [isOauthMode, setOauthMode] = useState(false);
  const [selectedDropboxService, setSelectedDropboxService] = useState(-1);
  const [selectedAccount, setSelectedAccount] = useState(-1);

  const onAgreeAddAccount = () => {
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
        .addAccount({
          accountName: titleValue.current,
          serviceIDX: selectedServiceIDX,
          OAuthAccountIDX: selectedAccount,
        })
        .then(() => {
          //메인스크린 계정 업데이트 함수 redux 건들기
          //
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      database
        .addAccount({
          accountName: titleValue.current,
          serviceIDX: selectedServiceIDX,
          id: accountValue.current,
          password: passwordValue.current,
        })
        .then(() => {
          //메인스크린 계정 업데이트 함수 redux 건들기
          //
        })
        .catch((error) => {
          console.log(error);
        });
    }

    visibleFunc(false);
  };
  const initInputData = () => {
    accountValue.current = '';
    passwordValue.current = '';
    setSelectedDropboxService(-1);
    setSelectedAccount(-1);
  };

  return (
    <ModalPopup
      containerWidth="300px"
      containerHeight="350px"
      isVisible={visible}
      headerTitle="계정 추가"
      onAgreeTitle="생성"
      onDenyTitle="취소"
      onAgree={onAgreeAddAccount}
      onDeny={() => {
        visibleFunc(false);
        setOauthMode(false);
      }}
      onBackdropPress={() => {
        visibleFunc(false);
        setOauthMode(false);
      }}>
      <BodyWrapper>
        <OauthWrapper>
          <OauthView>
            <StyledText>SNS 연동 로그인 등록하기</StyledText>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isOauthMode ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setOauthMode(!isOauthMode)}
              onChange={() => initInputData()}
              value={isOauthMode}
            />
          </OauthView>
          {isOauthMode ? (
            <View>
              <View>
                <StyledText fontWeight="700">서비스 선택</StyledText>
                <ServiceDropdown setServiceFunc={setSelectedDropboxService} />
              </View>
              <View>
                <StyledText fontWeight="700">계정 선택</StyledText>
                <AccountDropdown
                  setAccountFunc={setSelectedAccount}
                  serviceIdx={selectedDropboxService}
                />
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
    </ModalPopup>
  );
};

export default AddAccountModalPopup;
