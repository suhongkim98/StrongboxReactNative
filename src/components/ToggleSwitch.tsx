import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import theme from '../styles/theme';

interface ToggleBoxProps {
  isSelected: boolean;
}
const TotalWrapper = styled.TouchableOpacity`
  width: 30px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const ToggleBox = styled.View<ToggleBoxProps>`
  width: 15px;
  height: 15px;
  border-radius: 7px;
  border-width: 1px;
  background-color: ${(props) =>
    props.isSelected ? theme.colors.mainColor : 'white'};
`;
interface ToggleSwitchProps {
  onTrue: () => any;
  onFalse: () => any;
  navigation: any;
}
const ToggleSwitch = ({onTrue, onFalse, navigation}: ToggleSwitchProps) => {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      //화면 이탈 시 발생 이벤트
      setToggle(false);
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <TotalWrapper
      onPressIn={() => {
        if (toggle) {
          //기존에 TRUE였다면
          onFalse();
        } else {
          onTrue();
        }
        setToggle(!toggle);
      }}>
      <ToggleBox isSelected={toggle} />
    </TotalWrapper>
  );
};

export default ToggleSwitch;
