import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import {StrongboxDatabase} from '../../StrongboxDatabase.ts';
import {useDispatch, useSelector} from 'react-redux';
import {updateGroup} from '../../modules/groupList';
import {updateService} from '../../modules/serviceList';
import MenuSVG from '../../images/MenuSVG';
import SettingSVG from '../../images/SettingSVG';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/AntDesign';
import {LogBox, ScrollView} from 'react-native';
import AddAccountModalpopup from '../../components/AddAccountModalPopup';
import {updateAccount} from '../../modules/accountList';
import CryptoJS from 'react-native-crypto-js';
import AccountView from '../../components/AccountView';

LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']); // 일단 경고무시하자 ActionButton 라이브러리 문제

const TotalWrapper = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;
const HeaderWrapper = styled.View`
  padding: 0 20px 0 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: white;
  border-bottom-width: 1px;
  border-color: black;
  border-style: solid;
`;
const MenuButton = styled.TouchableOpacity``;
const BodyWrapper = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px 0 20px;
`;
const AdvertisementView = styled.View``; // 추후 광고 추가 예정
const StyledIcon = styled(Icon)`
  font-size: 20px;
  height: 22px;
  color: white;
`;

const MainScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [visibleAddAccountModal, setVisibleAddAccountModal] = useState(false);
  const selectedService = useSelector(
    (state: RootState) => state.selectedService.itemIndex,
  );
  const accountList = useSelector((state: RootState) => state.accountList.list);

  useEffect(() => {
    const database = StrongboxDatabase.getInstance();
    database
      .getGroup() // group redux 업데이트
      .then((result) => {
        const tmp = [];
        for (let i = 0; i < result.length; i++) {
          const row = result.item(i);
          tmp.push({GRP_IDX: row.IDX, GRP_NAME: row.GRP_NAME});
        }
        dispatch(updateGroup(tmp)); // 업데이트하자~~~~
      })
      .catch((error) => {
        console.log(error);
      });

    database
      .getService()
      .then((result) => {
        const tmp = [];
        for (let i = 0; i < result.length; i++) {
          const row = result.item(i);
          tmp.push({
            GRP_IDX: row.GRP_IDX,
            SERVICE_IDX: row.IDX,
            SERVICE_NAME: row.SERVICE_NAME,
          });
        }
        dispatch(updateService(tmp)); // 서비스 리스트 업데이트하자~~~~
      })
      .catch((error) => {
        console.log(error);
      });

    database
      .getAccount()
      .then((result) => {
        // 계정리스트 업데이트 하자
        const tmp = [];
        for (let i = 0; i < result.length; i++) {
          const item = result.item(i);
          const json = {
            ACCOUNT_IDX: item.IDX,
            SERVICE_IDX: item.SERVICE_IDX,
            ACCOUNT_NAME: item.ACCOUNT_NAME,
            DATE: item.DATE,
            OAUTH_LOGIN_IDX: item.OAUTH_LOGIN_IDX,
            OAUTH_SERVICE_NAME: item.OAUTH_SERVICE_NAME,
            ID: item.ID,
            PASSWORD: item.PASSWORD,
          }; // 기본항목
          if (item.PASSWORD) {
            //패스워드가 존재하면 복호화
            let bytes = CryptoJS.AES.decrypt(item.PASSWORD, global.key);
            let decrypted = bytes.toString(CryptoJS.enc.Utf8);
            json.PASSWORD = decrypted;
          }
          tmp.push(json);
        }
        dispatch(updateAccount(tmp));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);

  return (
    <TotalWrapper>
      <AddAccountModalpopup
        visible={visibleAddAccountModal}
        visibleFunc={setVisibleAddAccountModal}
        selectedServiceIDX={selectedService.idx}
      />
      <HeaderWrapper>
        <MenuButton
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <MenuSVG width="20px" height="20px" color="black" />
        </MenuButton>
        {selectedService.idx > 0 && (
          <StyledText size="20px" fontWeight="700">
            {selectedService.name}
          </StyledText>
        )}
        <MenuButton onPress={() => {}}>
          <SettingSVG width="20px" height="20px" color="black" />
        </MenuButton>
      </HeaderWrapper>
      <ScrollView>
        <BodyWrapper>
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅎㅎ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
          />
          <AccountView
            name="ㅋㅋ"
            date="2020-12-12"
            id="abvc"
            password="1232"
            oauthServiceName="페잇으북"
          />
          {selectedService.idx > 0 ? (
            accountList.map((row) => {
              if (row.SERVICE_IDX !== selectedService.idx) {
                return null;
              }
              return (
                <StyledText key={row.ACCOUNT_IDX} color="black">
                  {row.ACCOUNT_NAME}
                </StyledText>
              );
            })
          ) : (
            <StyledText size="16px" fontWeight="700">
              선택한 서비스가 없습니다.
            </StyledText>
          )}
        </BodyWrapper>
      </ScrollView>
      {selectedService.idx > 0 && (
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="계정 추가"
            onPress={() => {
              setVisibleAddAccountModal(true);
            }}>
            <StyledIcon name="pluscircleo" />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="계정 삭제"
            onPress={() => {}}>
            <StyledIcon name="delete" />
          </ActionButton.Item>
        </ActionButton>
      )}
      <AdvertisementView />
    </TotalWrapper>
  );
};

export default MainScreen;
