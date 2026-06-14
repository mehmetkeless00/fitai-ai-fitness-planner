import { View, Text } from 'react-native';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';

const WIDTH = 280;
const HEIGHT = 80;
const PAD = 12;

export default function Sparkline({ checkins, color = '#0ea5e9' }) {
  const withWeight = checkins.filter((c) => c.weight != null);

  if (withWeight.length < 2) {
    return (
      <View style={{ height: HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>
          Log at least 2 weight entries to see the trend.
        </Text>
      </View>
    );
  }

  const weights = withWeight.map((c) => c.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const plotW = WIDTH - PAD * 2;
  const plotH = HEIGHT - PAD * 2;

  const points = withWeight.map((c, i) => {
    const x = PAD + (i / (withWeight.length - 1)) * plotW;
    const y = PAD + plotH - ((c.weight - minW) / range) * plotH;
    return { x, y, weight: c.weight };
  });

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View>
      <Svg width={WIDTH} height={HEIGHT}>
        <Polyline
          points={polyPoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: PAD }}>
        <Text style={{ fontSize: 10, color: '#94a3b8' }}>{withWeight[0]?.date?.slice(5)}</Text>
        <Text style={{ fontSize: 10, color: '#94a3b8' }}>{withWeight[withWeight.length - 1]?.date?.slice(5)}</Text>
      </View>
    </View>
  );
}
