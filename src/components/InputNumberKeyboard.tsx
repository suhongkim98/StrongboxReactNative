import React from 'react';
import styled from 'styled-components';
import CleanSVG from '../images/CleanSVG';

interface InputNumberKeyboardProps {
  typingFunc: (newVal: string) => any;
  text: string;
}
const InputRow = styled.View`
  flex: 1;
  flex-direction: row;
`;
const InputButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled.Text`
  font-size: 25px;
  font-weight: 700;
`;

const InputNumberKeyboard = ({typingFunc, text}: InputNumberKeyboardProps) => {
  return (
    <>
      <InputRow>
        <InputButton
          onPress={() => {
            typingFunc(text + '1');
          }}>
          <ButtonText>1</ButtonText>
        </InputButton>
        <InputButton
          onPress={() => {
            typingFunc(text + '2');
          }}>
          <ButtonText>2</ButtonText>
        </InputButton>
        <InputButton
          onPress={() => {
            typingFunc(text + '3');
          }}>
          <ButtonText>3</ButtonText>
        </InputButton>
      </InputRow>
      <InputRow>
        <InputButton
          onPress={() => {
            typingFunc(text + '4');
          }}>
          <ButtonText>4</ButtonText>
        </InputButton>
        <InputButton
          onPress={() => {
            typingFunc(text + '5');
          }}>
          <ButtonText>5</ButtonText>
        </InputButton>
        <InputButton
          onPress={() => {
            typingFunc(text + '6');
          }}>
          <ButtonText>6</ButtonText>
        </InputButton>
      </InputRow>
      <InputRow>
        <InputButton
          onPress={() => {
            typingFunc(text + '7');
          }}>
          <ButtonText>7</ButtonText>
        </InputButton>
        <InputButton
          onPress={() => {
            typingFunc(text + '8');
          }}>
          <ButtonText>8</ButtonText>
        </InputButton>
        <InputButton
          onPress={() => {
            typingFunc(text + '9');
          }}>
          <ButtonText>9</ButtonText>
        </InputButton>
      </InputRow>
      <InputRow>
        <InputButton />
        <InputButton
          onPress={() => {
            typingFunc(text + '0');
          }}>
          <ButtonText>0</ButtonText>
        </InputButton>
        <InputButton
          onPress={() => {
            typingFunc('');
          }}>
          <CleanSVG width="25px" height="25px" color="black" />
        </InputButton>
      </InputRow>
    </>
  );
};

export default InputNumberKeyboard;
