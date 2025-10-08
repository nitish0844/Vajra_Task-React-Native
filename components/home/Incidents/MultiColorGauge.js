import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { IconArrowRight, IconPlus } from '@tabler/icons-react-native';
import { COLORS, SIZES } from '../../../constants/theme';

const createArc = (cx, cy, radius, startAngle, endAngle) => {
  const start = {
    x: cx + radius * Math.cos((Math.PI * startAngle) / 180),
    y: cy + radius * Math.sin((Math.PI * startAngle) / 180),
  };
  const end = {
    x: cx + radius * Math.cos((Math.PI * endAngle) / 180),
    y: cy + radius * Math.sin((Math.PI * endAngle) / 180),
  };
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const MultiColorGauge = ({ size = 200, data, title = "Gauge" }) => {
  const radius = size / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const endAngle = 405;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = startAngle;
  const arcs = data.map(item => {
    const angle = (item.value / total) * (endAngle - startAngle);
    const arc = { start: currentAngle, end: currentAngle + angle, color: item.color, label: item.label };
    currentAngle += angle;
    return arc;
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <IconArrowRight color={COLORS.black} size={24} />
      </View>

      {/* Gauge */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size / 1.5}>
          {arcs.map((arc, index) => (
            <Path
              key={index}
              d={createArc(cx, cy, radius - 10, arc.start, arc.end)}
              stroke={arc.color}
              strokeWidth={20} // same for all arcs
              fill="none"
              strokeLinecap="round"
            />
          ))}

          {/* Center Text: Total */}
          <SvgText
            x={cx}
            y={cy}
            fill="#333"
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {total}
          </SvgText>
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label} ({item.value})</Text>
          </View>
        ))}
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
        <IconPlus color={COLORS.white} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    width: SIZES.width * 0.85,
    margin: SIZES.base,
    flex: 1
  },
  header: { flexDirection: 'row', marginBottom: 16, justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginBottom: 8 },
  colorBox: { width: 16, height: 16, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 14, color: '#333' },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: SIZES.padding / 1.5,
    paddingHorizontal: SIZES.padding * 1.5,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default MultiColorGauge;
