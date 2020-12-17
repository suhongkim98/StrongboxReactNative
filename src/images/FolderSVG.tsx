import React from 'react';
import {SVGDefaultProps} from './SVGDefaultProps';
import Svg, {Path, G} from 'react-native-svg';

const FolderSVG = ({width, height}: SVGDefaultProps) => {
  return (
    <Svg
      id="Capa_1"
      enableBackground="new 0 0 483.246 483.246"
      height={height}
      viewBox="0 0 483.246 483.246"
      width={width}
      xmlns="http://www.w3.org/2000/svg">
      <G>
        <G id="icon_68_">
          <Path
            d="m424.914 143.074v249.748c.008 1.697-.174 3.389-.542 5.045l-1.621 5.404c-4.026 9.237-13.167 15.189-23.243 15.134h-374.098c-11.723-.033-21.911-8.059-24.687-19.448-.516-2.003-.758-4.067-.719-6.135v-306.177c-.023-12.02 9.703-21.783 21.723-21.805h.083 111.249c7.769.027 14.952 4.133 18.918 10.814l26.308 45.591h224.995c12 .052 21.686 9.822 21.634 21.823z"
            fill="#eaa14e"
          />
          <Path
            d="m461.206 180.939c12.173.001 22.041 9.869 22.04 22.042 0 2.193-.328 4.373-.971 6.47l-57.915 188.416-1.621 5.404c-4.026 9.237-13.167 15.189-23.243 15.134h-374.086c-11.723-.033-21.911-8.059-24.687-19.448l60.701-202.33c2.801-9.306 11.368-15.68 21.086-15.688z"
            fill="#f6b863"
          />
        </G>
      </G>
    </Svg>
  );
};

export default FolderSVG;