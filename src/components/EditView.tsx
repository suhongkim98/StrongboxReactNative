import React from 'react';
import styled from 'styled-components';
import StyledText from '../components/StyledText';
import theme from '../styles/theme';
import Icon from 'react-native-vector-icons/AntDesign';

const TotalWrapper = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.backgroundMainColor};
`;
const StyledIcon = styled(Icon)`
  font-size: 20px;
  height: 22px;
  color: black;
`;
const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  height: 60px;
  border-bottom-width: 1px;
`;
const HeaderItemButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 20px 0 20px;
  height: 100%;
`;
const BodyWrapper = styled.View`
  padding: 0 20px 0 20px;
  flex: 1;
`;
const FooterWrapper = styled.View`
  height: 80px;
  justify-content: center;
  align-items: center;
  padding: 0 20px 0 20px;
`;
interface DeleteButtonProps {
  isSelected: boolean;
}
const DeleteButton = styled.TouchableOpacity<DeleteButtonProps>`
  width: 100%;
  height: 40px;
  background-color: ${(props) => (props.isSelected ? 'darkred' : 'gray')};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
const AdvertisementView = styled.View``;
interface EditViewProps {
  onPressBackButton: () => any;
  onPressDeleteButton: () => any;
  children?: any;
  isSelected: boolean;
}
const EditView = ({
  onPressBackButton,
  onPressDeleteButton,
  children,
  isSelected,
}: EditViewProps) => {
  return (
    <TotalWrapper>
      <HeaderWrapper>
        <HeaderItemButton onPress={onPressBackButton}>
          <StyledIcon name="arrowleft" />
        </HeaderItemButton>
        <StyledText fontWeight="700" size="16px">
          편집
        </StyledText>
        <HeaderItemButton>
          <StyledText color="darkred" fontWeight="700" size="16px" />
        </HeaderItemButton>
      </HeaderWrapper>
      <BodyWrapper>{children}</BodyWrapper>
      <FooterWrapper>
        <DeleteButton
          onPress={() => {
            isSelected && onPressDeleteButton();
          }}
          isSelected={isSelected}>
          <StyledText color="white" fontWeight="700">
            삭제
          </StyledText>
        </DeleteButton>
      </FooterWrapper>
      <AdvertisementView />
    </TotalWrapper>
  );
};

export default EditView;
