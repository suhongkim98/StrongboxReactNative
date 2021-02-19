import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

const TotalWrapper = styled.View`
  width: 100%;
  height: 100px;
  background-color: white;
  border-color: black;
  border-width: 1px;
  padding: 0 20px 0 20px;
  margin-bottom: 10px;
`;
const HeaderWrapper = styled.View`
  width: 100%;
  height: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
`;
const BodyWrapper = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const BodyItem = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const OauthArea = styled.View`
  width: 100%;
  height: 20px;
  justify-content: center;
`;

interface AccountViewProps {
  name: string;
  date: string;
  id?: string;
  password?: string;
  oauthServiceName?: string;
}
const AccountView = ({
  name,
  date,
  id,
  password,
  oauthServiceName,
}: AccountViewProps) => {
  return (
    <TotalWrapper>
      <HeaderWrapper>
        <StyledText fontWeight="700" size="20px">
          {name}
        </StyledText>
        <StyledText size="12px">수정일: {date}</StyledText>
      </HeaderWrapper>
      <BodyWrapper>
        <OauthArea>
          {oauthServiceName && (
            <StyledText fontWeight="700" color="darkred">
              (!) {oauthServiceName}(으)로 소셜로그인한 계정입니다.
            </StyledText>
          )}
        </OauthArea>
        <BodyItem>
          <StyledText fontWeight="700" size="16px">
            아이디
          </StyledText>
          <StyledText size="16px">{id}</StyledText>
        </BodyItem>
        <BodyItem>
          <StyledText fontWeight="700" size="16px">
            패스워드
          </StyledText>
          <StyledText size="16px">{password}</StyledText>
        </BodyItem>
      </BodyWrapper>
    </TotalWrapper>
  );
};

export default AccountView;
