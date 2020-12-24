import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import StyledText from './StyledText';

const ContainerInnerWrapper = styled.View`
  flex: 1;
`;
const ModalButton = styled.TouchableOpacity`
  margin: 0 20px 0 0;
`;
const StyleModal = styled(Modal)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const HeaderModal = styled.View`
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const BodyModal = styled.View`
  flex: 1;
  padding: 0 5px 0 5px;
`;
const FooterModal = styled.View`
  height: 40px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
interface ModalContainerProps {
  width: string;
  height: string;
}
const ModalContainer = styled.View<ModalContainerProps>`
  min-width: 100px;
  width: ${(props) => props.width};
  min-height: 100px;
  height: ${(props) => props.height};
  background-color: white;
  border-radius: 5px;
`;

interface ModalPopupProps {
  containerWidth: string;
  containerHeight: string;
  children: any;
  onAgree: () => any;
  onDeny: () => any;
  headerTitle: string;
  onAgreeTitle: string;
  onDenyTitle: string;
  //
  isVisible: boolean;
  onBackdropPress: () => any;
}
const ModalPopup = ({
  containerWidth,
  containerHeight,
  children,
  headerTitle,
  isVisible,
  onBackdropPress,
  onAgreeTitle,
  onDenyTitle,
  onAgree,
  onDeny,
}: ModalPopupProps) => {
  return (
    <StyleModal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      useNativeDriver={true}>
      <ModalContainer width={containerWidth} height={containerHeight}>
        <ContainerInnerWrapper>
          <HeaderModal>
            <StyledText color="black" size="20px">
              {headerTitle}
            </StyledText>
          </HeaderModal>
          <BodyModal>{children}</BodyModal>
          <FooterModal>
            <ModalButton onPress={onAgree}>
              <StyledText color="navy" size="16px">
                {onAgreeTitle}
              </StyledText>
            </ModalButton>
            <ModalButton onPress={onDeny}>
              <StyledText color="navy" size="16px">
                {onDenyTitle}
              </StyledText>
            </ModalButton>
          </FooterModal>
        </ContainerInnerWrapper>
      </ModalContainer>
    </StyleModal>
  );
};

export default ModalPopup;
