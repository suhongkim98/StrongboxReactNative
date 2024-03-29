import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components/native';
import StyledText from '../../components/StyledText';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupAsync } from '../../modules/groupList';
import { updateServiceAsync } from '../../modules/serviceList';
import MenuSVG from '../../images/MenuSVG';
import SettingSVG from '../../images/SettingSVG';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/AntDesign';
import { LogBox, View } from 'react-native';
import AccountView from '../../components/AccountView';
import theme from '../../styles/theme';
import { updateAccountAsync } from '../../modules/accountList';
import Toast from 'react-native-root-toast';
import { RootState } from '../../modules';
import BannerContainer from '../../components/BannerContainer';
import { ScrollView } from 'react-native-gesture-handler';
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']); // 일단 경고무시하자 ActionButton 라이브러리 문제

const TotalWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.backgroundMainColor};
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
  padding: 30px 20px 0 20px;
`;
const AdvertisementView = styled.View``; // 추후 광고 추가 예정
const StyledIcon = styled(Icon)`
  font-size: 20px;
  height: 22px;
  color: white;
`;

const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selectedService = useSelector(
    (state: RootState) => state.selectedService.itemIndex,
  );
  const accountList = useSelector((state: RootState) => state.accountList.list);

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
    dispatch(updateGroupAsync());
    dispatch(updateServiceAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(updateAccountAsync(selectedService.idx)); //selectedService가 바뀔 때마다 리덕스 업데이트
  }, [dispatch, selectedService.idx]);

  const printAccountView = () => {
    console.log(accountList);
    if (accountList.length <= 0) {
      return <StyledText fontWeight="700" center>존재하는 계정이 없습니다.{'\n\n'}+버튼을 눌러 계정을 추가해주세요.</StyledText>;
    }
    return accountList.map((row) => {
      return (
        <AccountView
          key={row.SORT_ORDER}
          name={row.ACCOUNT_NAME}
          date={row.DATE}
          id={row.ID}
          password={row.PASSWORD}
          oauthServiceName={row.OAUTH_SERVICE_NAME}
        />
      );
    });
  };

  return (
    <TotalWrapper>
      <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}>
        {toastMessage}
      </Toast>
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
        <MenuButton onPress={() => {
          navigation.navigate('SettingScreen');
        }}>
          <SettingSVG width="20px" height="20px" color="black" />
        </MenuButton>
      </HeaderWrapper>
      <BodyWrapper>
        <ScrollView>
          {selectedService.idx > 0 ? (
            printAccountView()
          ) : (
            <View>
            <StyledText size="16px" fontWeight="700" center>
              선택한 서비스가 없습니다.
            </StyledText>
            <StyledText center fontWeight="700">{'\n\n\n'}메뉴 -&gt; 수정하기를 눌러 폴더 및 서비스를 추가한 후{'\n\n'}계정을 추가해주세요.</StyledText>
            </View>
          )}
        </ScrollView>

        {selectedService.idx > 0 && (
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="계정 추가"
              onPress={() => {
                navigation.navigate('AddAccountScreen', {
                  serviceIdx: selectedService.idx,
                });
              }}>
              <StyledIcon name="pluscircleo" />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#3498db"
              title="편집"
              onPress={() => {
                navigation.navigate('EditAccountScreen', {
                  serviceIdx: selectedService.idx,
                });
              }}>
              <StyledIcon name="delete" />
            </ActionButton.Item>
          </ActionButton>
        )}
      </BodyWrapper>


      <AdvertisementView>
        <BannerContainer />
      </AdvertisementView>
    </TotalWrapper>
  );
};

export default MainScreen;
