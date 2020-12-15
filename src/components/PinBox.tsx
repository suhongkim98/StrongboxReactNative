import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

interface PinBoxProps {
  val: string;
  length: number;
}

const TotalWrapper = styled.View`
  width: 300px;
  position: relative;
  flex-direction: row;
  justify-content: space-evenly;
`;

interface BoxProps {
  isChecked: boolean;
}
const Box = styled.View<BoxProps>`
  height: 30px;
  width: 30px;
  border: 1px solid grey;
  border-radius: 20px;
  background-color: ${(props) => (props.isChecked ? '#565666' : 'white')};
`;

const PinBox = ({val, length}: PinBoxProps) => {
  const PIN_LENGTH = length; // pin번호 길이
  const [checked, setChecked] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [boxList, setBoxList] = useState([]);

  useEffect(() => {
    const tmp = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      tmp.push(<Box key={i} isChecked={checked[i]} />);
    }
    setBoxList(tmp);
  }, [PIN_LENGTH, checked]);

  useEffect(() => {
    const tmp = [false, false, false, false, false, false];
    for (let i = 0; i < val.length; i++) {
      tmp[i] = true;
    }
    setChecked(tmp);
  }, [val]);

  return <TotalWrapper>{boxList}</TotalWrapper>;
};

export default PinBox;
