import React from 'react';
import {SVGDefaultProps} from './SVGDefaultProps';
import Svg, {Path} from 'react-native-svg';

const CleanSVG = ({width, height, color}: SVGDefaultProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      x="0"
      y="0"
      enableBackground="new 0 0 414.824 414.824"
      version="1.1"
      viewBox="0 0 414.824 414.824"
      xmlSpace="preserve">
      <Path
        d="M404.898 115.723l-78.89-78.89c-12.963-12.541-33.535-12.541-46.498 0L114.939 201.405l125.388 125.388 164.571-164.571a33.438 33.438 0 009.927-23.51 31.874 31.874 0 00-9.927-22.989z"
        className="active-path"
        data-original="#000000"
        fill={color}
      />
      <Path
        d="M306.155 371.723H196.441l32.914-33.437-125.388-125.91-49.11 49.11c-12.606 13.139-12.606 33.881 0 47.02l62.694 63.216H7.837a7.837 7.837 0 000 15.674h298.318a7.837 7.837 0 000-15.673z"
        className="active-path"
        data-original="#000000"
        fill={color}
      />
    </Svg>
  );
};

export default CleanSVG;
