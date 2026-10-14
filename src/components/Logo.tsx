import { Image, useWindowDimensions } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { getLogoSize } from './Logo.styles';

const logo: ImageSourcePropType = require('../../assets/logo.png');

export function Logo() {
  const { width, height } = useWindowDimensions();
  return (
    <Image
      source={logo}
      style={getLogoSize(width, height)}
      resizeMode="contain"
      accessibilityLabel="HiveMind Apiary Manager"
    />
  );
}
