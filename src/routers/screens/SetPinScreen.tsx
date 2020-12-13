import React, {useRef,useState,useEffect} from 'react';
import { View, TouchableOpacity, Alert} from 'react-native';
import styled from 'styled-components/native';
import {StrongboxDatabase} from '../../StrongboxDatabase';
import theme from '../../styles/theme';
import CleanSVG from '../../images/CleanSVG';
import PinBox from '../../components/PinBox';
import StyledText from '../../components/StyledText';

const TotalWrapper = styled.View`
flex:1;
background-color:${theme.colors.backgroundMainColor};
`;
const ViewBody = styled.View`
flex:0.65;
justify-content:space-evenly;
align-items:center;
`;
const PaddingView = styled.View`
width:100%;
padding: 0 40px 0 40px;
`;
const PinView = styled.View`
width:100%;
height:140px;
background-color:#E9E9EA;
justify-content:space-evenly;
align-items:center;

border-radius:5px;
`;
const InputView = styled.View`
flex:0.35;
background-color:#E9E9EA;
`;
const InputRow = styled.View`
flex:1;
flex-direction:row;
`;
const InputButton = styled.TouchableOpacity`
flex:1;
justify-content:center;
align-items:center;
`;
const ButtonText = styled.Text`
font-size:25px;
font-weight:700;
`;

const InputBox = styled.TextInput`
position:absolute;
left:0;
top:0;
width:100%;
height:100%;
color: transparent; // 입력한거 안보이게
`;
const SetPinScreen = ({ navigation }) =>{
    const PIN_LENGTH = 6;
    const [pin,setPin] = useState('');

    const [checkPin, setCheckPin] = useState(false);
    const beforePin = useRef('');

    useEffect(()=>{
        if(!checkPin){
            if(pin.length >= PIN_LENGTH){
                setPin(''); //초기화
                setCheckPin(true);
                beforePin.current = pin;
            }
        } else {
            if(pin.length >= PIN_LENGTH){
                if(beforePin.current === pin){
                    alert("맞음" + pin);
                    //사용자 등록 후 스크린 이동 구현하기

                    //
                }else{
                    Alert.alert("비밀번호가 일치하지 않습니다.","다시 입력해주세요",[{text: '확인', onPress:()=>{}}]);
                    setPin('');
                    beforePin.current = '';
                    setCheckPin(false);
                }
            }
        }
    },[pin]);

    return <TotalWrapper>
    <ViewBody>
        <StyledText color="white" fontWeight="700" size="30px">Accong Box</StyledText>
        <PaddingView>
        <PinView>
            {checkPin ? <StyledText color="darkred" fontWeight="700" size="30px">Pin 확인</StyledText> : <StyledText color="darkred" fontWeight="700" size="30px">Pin 설정</StyledText>} 
            <PinBox val={pin} length={PIN_LENGTH}/>
        </PinView>
        </PaddingView>
        <View style={{paddingBottom: 50}}>
        <StyledText color="lightyellow" fontWeight="600" size="13px" center >(!) 핀번호는 데이터를 암호화하기 위한 중요한 암호입니다.{"\n"}분실하면 복구가 불가능하니 신중하게 설정해주세요.</StyledText>
        </View>
    </ViewBody>
    <InputView>
        <InputRow><InputButton onPress={()=>{setPin(pin + '1')}}><ButtonText>1</ButtonText></InputButton><InputButton onPress={()=>{setPin(pin + '2')}}><ButtonText>2</ButtonText></InputButton><InputButton onPress={()=>{setPin(pin + '3')}}><ButtonText>3</ButtonText></InputButton></InputRow>
        <InputRow><InputButton onPress={()=>{setPin(pin + '4')}}><ButtonText>4</ButtonText></InputButton><InputButton onPress={()=>{setPin(pin + '5')}}><ButtonText>5</ButtonText></InputButton><InputButton onPress={()=>{setPin(pin + '6')}}><ButtonText>6</ButtonText></InputButton></InputRow>
        <InputRow><InputButton onPress={()=>{setPin(pin + '7')}}><ButtonText>7</ButtonText></InputButton><InputButton onPress={()=>{setPin(pin + '8')}}><ButtonText>8</ButtonText></InputButton><InputButton onPress={()=>{setPin(pin + '9')}}><ButtonText>9</ButtonText></InputButton></InputRow>
        <InputRow><InputButton></InputButton><InputButton onPress={()=>{setPin(pin + '0')}}><ButtonText>0</ButtonText></InputButton><InputButton onPress={()=>{setPin('')}}><CleanSVG width="25px" height="25px" color="black"/></InputButton></InputRow>
    </InputView>
    </TotalWrapper>
}

export default SetPinScreen;