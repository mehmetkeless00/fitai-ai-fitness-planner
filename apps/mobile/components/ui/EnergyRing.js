import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// Outer ring: energy (#FF6B5E, r ratio 62/80), inner ring: protein (#14C06A, r ratio 44/80)
export default function EnergyRing({
  energyProgress = 0,
  proteinProgress = 0,
  size = 160,
  strokeWidth = 10,
  children,
}) {
  const center = size / 2;
  const scale = size / 160;
  const outerR = 62 * scale;
  const innerR = 44 * scale;
  const sw = strokeWidth * scale;
  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;
  const outerOffset = outerC * (1 - clamp(energyProgress, 0, 1));
  const innerOffset = innerC * (1 - clamp(proteinProgress, 0, 1));

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, transform: [{ rotate: '-90deg' }] }}
      >
        <Circle cx={center} cy={center} r={outerR} fill="none" stroke="#F5EDE9" strokeWidth={sw} />
        <Circle cx={center} cy={center} r={innerR} fill="none" stroke="#E8F8EF" strokeWidth={sw} />
        <Circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="#FF6B5E"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={outerC}
          strokeDashoffset={outerOffset}
        />
        <Circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke="#14C06A"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={innerC}
          strokeDashoffset={innerOffset}
        />
      </Svg>
      {children && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {children}
        </View>
      )}
    </View>
  );
}
