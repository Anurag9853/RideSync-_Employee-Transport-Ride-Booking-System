import React, { useState } from 'react';

// Help helper to get min/max for scale
const getBoundaries = (data, key) => {
  const values = data.map((d) => d[key]);
  const max = Math.max(...values, 10);
  const min = Math.min(...values, 0);
  const range = max - min;
  // Pad the top a bit
  const yMax = max + range * 0.1;
  return { min, max: yMax };
};

export function LineChart({ data, xKey, yKey, height = 200 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  if (!data || data.length === 0) return <div className="text-muted flex-center" style={{ height }}>No data available</div>;

  const width = 500;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const { min, max } = getBoundaries(data, yKey);
  const yRange = max - min;

  // Convert points to coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d[yKey] - min) / yRange) * chartHeight;
    return { x, y, value: d[yKey], label: d[xKey] };
  });

  // Calculate Bezier path for smooth curves
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
  }

  // Calculate closed path for area gradient fill
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Generate Y axis ticks
  const yTicks = Array.from({ length: 4 }).map((_, i) => {
    const val = min + (yRange / 3) * i;
    const y = paddingTop + chartHeight - (i / 3) * chartHeight;
    return { val: Math.round(val), y };
  });

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={width - paddingRight}
              y2={tick.y}
              stroke="var(--border-color)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <text
              x={paddingLeft - 10}
              y={tick.y + 4}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize="10"
              fontFamily="var(--font-sans)"
            >
              {tick.val}
            </text>
          </g>
        ))}

        {/* Closed Gradient Area */}
        {areaD && <path d={areaD} fill="url(#lineGrad)" />}

        {/* Line Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}

        {/* X Axis Labels & Interactive Guideline Circles */}
        {points.map((pt, i) => {
          const showLabel = points.length < 12 || i % Math.ceil(points.length / 8) === 0;
          return (
            <g key={i}>
              {showLabel && (
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontFamily="var(--font-sans)"
                >
                  {pt.label}
                </text>
              )}

              {/* Hover Trigger Zone */}
              <rect
                x={pt.x - (chartWidth / (data.length - 1)) / 2}
                y={paddingTop}
                width={chartWidth / (data.length - 1)}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Hover Guide Line */}
              {hoveredIdx === i && (
                <line
                  x1={pt.x}
                  y1={paddingTop}
                  x2={pt.x}
                  y2={paddingTop + chartHeight}
                  stroke="var(--primary)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  pointerEvents="none"
                />
              )}

              {/* Node Circle */}
              {(hoveredIdx === i || points.length < 15) && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === i ? 5 : 3.5}
                  fill="var(--bg-card)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  pointerEvents="none"
                  style={{ transition: 'r 0.1s ease' }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip HTML Overlay */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          style={{
            position: 'absolute',
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 35}%`,
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            fontSize: '11px',
            color: 'var(--text-main)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          <span style={{ fontWeight: 600 }}>{points[hoveredIdx].label}:</span> {points[hoveredIdx].value}
        </div>
      )}
    </div>
  );
}

export function BarChart({ data, xKey, yKey, height = 200 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  if (!data || data.length === 0) return <div className="text-muted flex-center" style={{ height }}>No data available</div>;

  const width = 500;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const { min, max } = getBoundaries(data, yKey);
  const yRange = max - min;

  const barCount = data.length;
  const gapRatio = 0.35; // 35% gap
  const rawBarWidth = chartWidth / barCount;
  const barGap = rawBarWidth * gapRatio;
  const barWidth = rawBarWidth - barGap;

  const yTicks = Array.from({ length: 4 }).map((_, i) => {
    const val = min + (yRange / 3) * i;
    const y = paddingTop + chartHeight - (i / 3) * chartHeight;
    return { val: Math.round(val), y };
  });

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        {/* Grid Lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={width - paddingRight}
              y2={tick.y}
              stroke="var(--border-color)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <text
              x={paddingLeft - 10}
              y={tick.y + 4}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize="10"
              fontFamily="var(--font-sans)"
            >
              {tick.val}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const value = d[yKey];
          const x = paddingLeft + (i * rawBarWidth) + (barGap / 2);
          const barH = ((value - min) / yRange) * chartHeight;
          const y = paddingTop + chartHeight - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill={hoveredIdx === i ? 'var(--primary-hover)' : 'var(--primary)'}
                rx={Math.min(barWidth / 3, 4)}
                style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-sans)"
              >
                {d[xKey]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIdx !== null && data[hoveredIdx] && (
        <div
          style={{
            position: 'absolute',
            left: `${((paddingLeft + (hoveredIdx * rawBarWidth) + (barGap / 2) + barWidth / 2) / width) * 100}%`,
            top: `${((paddingTop + chartHeight - ((data[hoveredIdx][yKey] - min) / yRange) * chartHeight) / height) * 100 - 35}%`,
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            fontSize: '11px',
            color: 'var(--text-main)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          <span style={{ fontWeight: 600 }}>{data[hoveredIdx][xKey]}:</span> {data[hoveredIdx][yKey]}
        </div>
      )}
    </div>
  );
}

export function DonutChart({ data, nameKey, valueKey }) {
  if (!data || data.length === 0) return <div className="text-muted flex-center" style={{ height: 160 }}>No data available</div>;

  const total = data.reduce((acc, curr) => acc + curr[valueKey], 0);
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Custom premium color palette matching HSL slate / blues
  const colors = [
    'var(--primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-info)',
    '#f472b6',
    '#a78bfa'
  ];

  let accumulatedAngle = 0;

  const slices = data.map((d, index) => {
    const percentage = total > 0 ? (d[valueKey] / total) : 0;
    const strokeDashoffset = circumference - percentage * circumference;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const rotateAngle = accumulatedAngle;
    accumulatedAngle += percentage * 360;

    return {
      ...d,
      strokeDasharray,
      strokeDashoffset,
      rotateAngle,
      color: colors[index % colors.length],
      percentageText: `${(percentage * 100).toFixed(1)}%`
    };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
        />
        {slices.map((slice, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={strokeWidth}
            strokeDasharray={slice.strokeDasharray}
            strokeDashoffset={0}
            transform={`rotate(${-90 + slice.rotateAngle} ${center} ${center})`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease',
              transformOrigin: `${center}px ${center}px`
            }}
          />
        ))}
        {/* Centered Total Label */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="10"
          fontWeight="500"
          fontFamily="var(--font-sans)"
        >
          TOTAL
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          fill="var(--text-main)"
          fontSize="16"
          fontWeight="700"
          fontFamily="var(--font-mono)"
        >
          {total}
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '140px' }}>
        {slices.map((slice, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: slice.color }} />
              <span style={{ color: 'var(--text-muted)' }}>{slice[nameKey]}</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {slice[valueKey]} ({slice.percentageText})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBarChart({ data, nameKey, valueKey, labelSuffix = '' }) {
  if (!data || data.length === 0) return <div className="text-muted flex-center" style={{ height: 160 }}>No data available</div>;

  const values = data.map((d) => d[valueKey]);
  const max = Math.max(...values, 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {data.map((item, idx) => {
        const value = item[valueKey];
        const percentage = (value / max) * 100;
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item[nameKey]}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {value}
                {labelSuffix}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--border-color)',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
