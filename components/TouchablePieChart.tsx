// components/TouchablePieChart.tsx
import React from "react";
import Svg, { G, Path } from "react-native-svg";

export type Slice = { label: string; value: number; color: string };

type Props = {
  data: Slice[];
  size?: number;
  innerRadius?: number;
  onSelect?: (index: number) => void;
};

export default function TouchablePieChart({
  data,
  size = 200,
  innerRadius = 62,
  onSelect,
}: Props) {
  const total = Math.max(1, data.reduce((s, d) => s + d.value, 0));
  const radius = size / 2;

  let start = 0;
  const paths = data.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2;
    const x0 = radius + radius * Math.cos(start);
    const y0 = radius + radius * Math.sin(start);
    const end = start + angle;
    const x1 = radius + radius * Math.cos(end);
    const y1 = radius + radius * Math.sin(end);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${radius} ${radius}
                  L ${x0} ${y0}
                  A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1}
                  Z`;
    const midAngle = start + angle / 2;
    start = end;
    return { d: path, color: d.color, i, midAngle };
  });

  const hole = `M ${radius} ${radius}
                m -${innerRadius}, 0
                a ${innerRadius},${innerRadius} 0 1,0 ${innerRadius * 2},0
                a ${innerRadius},${innerRadius} 0 1,0 -${innerRadius * 2},0`;

  return (
    <Svg width={size} height={size}>
      <G>
        {paths.map((p) => (
          <Path
            key={p.i}
            d={p.d}
            fill={p.color}
            onPress={() => onSelect?.(p.i)}
          />
        ))}
        <Path d={hole} fill="#F7F8FB" />
      </G>
    </Svg>
  );
}
