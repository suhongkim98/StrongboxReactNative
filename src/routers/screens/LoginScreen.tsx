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
const LoginScreen = ({ navigation }) =>{
    const PIN_LENGTH = 6;
    const [pin,setPin] = useState('');

    useEffect(()=>{
        if(pin.length >= PIN_LENGTH){
            //로그인
            const database = StrongboxDatabase.getInstance();
            database.validUser(pin).then((result)=>{
                if(result !== false){
                    // 로그인 성공
                    global.key = result;
                    navigation.reset({routes: [{ name: "Main" }]});
                    console.log(global.key);
                }else {
                    //로그인 실패 // 비밀번호 틀림
                    Alert.alert("비밀번호가 일치하지 않습니다.","다시 입력해주세요",[{text: '확인', onPress:()=>{}}]);
                    setPin('');
                }
            }).catch((error:any)=>{
                console.log(error);
            });
        }
    },[pin]);

    return <TotalWrapper>
    <ViewBody>
        <StyledText color="white" fontWeight="700" size="30px">Accong Box</StyledText>
        <PaddingView>
        <PinView>
            <StyledText color="lightyellow" fontWeight="700" size="30px">Pin 입력</StyledText>
            <PinBox val={pin} length={PIN_LENGTH}/>
        </PinView>
        </PaddingView>
        <View style={{paddingBottom: 50}}>
        <StyledText color="lightyellow" fontWeight="600" size="13px" center >(!) 비밀번호를 분실하셨나요?</StyledText>
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

export default LoginScreen;