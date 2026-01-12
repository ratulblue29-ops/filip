import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

const PremiumIcon: React.FC<Props> = ({
  size = 41,
  color = '#FCD34D',
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 41 41"
      fill="none"
    >
      <Path
        d="M20.2501 39.5358L30.5358 29.2501
           M20.2501 39.5358L9.96435 29.2501
           M20.2501 39.5358V0.964355
           M30.5358 29.2501V11.2501
           M30.5358 29.2501H9.96435
           M30.5358 11.2501L20.2501 0.964355
           M30.5358 11.2501H9.96435
           M20.2501 0.964355L9.96435 11.2501
           M9.96435 11.2501V29.2501
           M35.6786 20.2501H39.5358
           M34.3929 6.10721L36.9644 3.53578
           M34.3929 34.3929L36.9644 36.9644
           M4.8215 20.2501H0.964355
           M6.10721 6.10721L3.53578 3.53578
           M6.10721 34.3929L3.53578 36.9644"
        stroke={color}
        strokeWidth={1.92857}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PremiumIcon;
