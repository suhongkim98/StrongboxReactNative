import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components';

interface StyledTextProps {
    size?:string;
    fontWeight?:string;
    color?:string;
    children?:any;
    center?:boolean;
}

const TotalWrapper = styled.Text<StyledTextProps>`
${({color}) => 
//텍스트 컬러가 있다면
    color &&
    `color:${color};`
}
${({size}) => 
    size &&
    `fontSize:${size};`
}

${({fontWeight}) => 
    fontWeight &&
    `fontWeight:${fontWeight};`
}
${({center}) => 
    center &&
    `text-align: center;`
}
`;

const StyledText = ({size,fontWeight,color,children,center}:StyledTextProps) =>{
return <TotalWrapper size={size} fontWeight={fontWeight} color={color} center={center}>{children}</TotalWrapper>
}

export default StyledText;