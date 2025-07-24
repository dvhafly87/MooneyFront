import React, { memo, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CategoryChart = memo(({ data = [] }) => {
  // 데이터가 없을 때 기본 메시지 표시 - useMemo로 캐싱
  const emptyMessage = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            color: '#999',
            fontSize: '14px',
          }}
        >
          소비 데이터가 없습니다
        </div>
      );
    }
    return null;
  }, [data]);

  // 커스텀 툴팁 컴포넌트 - useCallback으로 최적화
  const CustomTooltip = useCallback(({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '12px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: 0, color: data.payload.color }}>
            {new Intl.NumberFormat('ko-KR').format(data.value)}원
          </p>
        </div>
      );
    }
    return null;
  }, []);

  // 라벨 렌더링 함수 - useCallback으로 최적화
  const renderCustomizedLabel = useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      if (percent < 0.05) return null; // 5% 미만이면 라벨 숨김

      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
      const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize="11"
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    },
    [],
  );

  // 범례 포맷터 - useCallback으로 최적화
  const legendFormatter = useCallback((value, entry) => {
    return <span style={{ color: entry.color }}>{value}</span>;
  }, []);

  // 셀 렌더링 최적화 - useMemo로 미리 계산
  const cells = useMemo(() => {
    return data.map((entry, index) => (
      <Cell key={`cell-${index}-${entry.name}`} fill={entry.color} />
    ));
  }, [data]);

  // 빈 데이터일 때 조기 반환
  if (emptyMessage) {
    return emptyMessage;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
          // 애니메이션 최적화
          animationBegin={0}
          animationDuration={900}
        >
          {cells}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px' }} formatter={legendFormatter} />
      </PieChart>
    </ResponsiveContainer>
  );
});

// displayName 설정 (개발자 도구에서 확인용)
CategoryChart.displayName = 'CategoryChart';

export default CategoryChart;
