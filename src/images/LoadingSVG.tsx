import React from 'react';
import {SVGDefaultProps} from './SVGDefaultProps';
import Svg, {Circle} from 'react-native-svg';

const LoadingSVG = ({width, height, color}: SVGDefaultProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid">
      <Circle
        cx="50"
        cy="50"
        fill="none"
        stroke={color}
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138">
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </Circle>
    </Svg>
  ); //<!-- [ldio] generated by https://loading.io/ -->
};
export default LoadingSVG;
