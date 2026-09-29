import React from 'react';
import type { GpsArtCourse } from '../types/course';

interface CourseMiniPreviewProps {
  course: GpsArtCourse;
  showIllustration?: boolean;
  size?: number;
}

export const CourseMiniPreview: React.FC<CourseMiniPreviewProps> = ({
  course,
  showIllustration = true,
  size = 88,
}) => {
  const coords = course.coordinates;
  if (!coords || coords.length < 2) {
    return <div style={{ width: size, height: size }} className="bg-zinc-100 rounded-xl" />;
  }

  const lats = coords.map((c) => c[0]);
  const lngs = coords.map((c) => c[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latSpan = Math.max(maxLat - minLat, 0.0001);
  const lngSpan = Math.max(maxLng - minLng, 0.0001);
  const padding = 12;
  const inner = size - padding * 2;

  // Keep aspect ratio
  const scale = Math.min(inner / lngSpan, inner / latSpan);
  const offsetX = padding + (inner - lngSpan * scale) / 2;
  const offsetY = padding + (inner - latSpan * scale) / 2;

  const toXY = (lat: number, lng: number): [number, number] => {
    const x = offsetX + (lng - minLng) * scale;
    const y = size - (offsetY + (lat - minLat) * scale);
    return [x, y];
  };

  const pointsStr = coords
    .map(([lat, lng]) => {
      const [x, y] = toXY(lat, lng);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex-shrink-0 rounded-xl bg-zinc-900/95 border border-zinc-800/80 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-[1.03] transition-transform"
    >
      {/* Subtle monochrome grid lines to evoke gallery map */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <defs>
          <pattern
            id={`grid-${course.id}`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 14 0 L 0 0 0 14"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.7"
            />
          </pattern>
        </defs>
        <rect width={size} height={size} fill={`url(#grid-${course.id})`} />

        {/* Illustration fill layer */}
        {showIllustration && (
          <polygon
            points={pointsStr}
            fill={course.accentColor}
            fillOpacity={0.22}
          />
        )}

        {/* Outer glow polyline */}
        <polyline
          points={pointsStr}
          fill="none"
          stroke={course.accentColor}
          strokeOpacity={0.35}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Crisp GPS art stroke */}
        <polyline
          points={pointsStr}
          fill="none"
          stroke={course.accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Render eyes/nose decorations on mini preview */}
        {showIllustration &&
          course.decorations.map((dec) => {
            const [cx, cy] = toXY(dec.position[0], dec.position[1]);
            if (dec.type === 'eye') {
              return (
                <g key={dec.id}>
                  <circle cx={cx} cy={cy} r={2.8} fill="#FFFFFF" />
                  <circle cx={cx + 0.4} cy={cy - 0.3} r={1.5} fill="#18181B" />
                </g>
              );
            }
            if (dec.type === 'nose') {
              return (
                <circle
                  key={dec.id}
                  cx={cx}
                  cy={cy}
                  r={2.4}
                  fill={dec.color || '#18181B'}
                />
              );
            }
            if (dec.type === 'blush') {
              return (
                <ellipse
                  key={dec.id}
                  cx={cx}
                  cy={cy}
                  rx={3.2}
                  ry={1.8}
                  fill={dec.color || '#FB7185'}
                  fillOpacity={0.65}
                />
              );
            }
            return null;
          })}
      </svg>
      <span className="absolute bottom-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-black/65 text-zinc-200 backdrop-blur-xs">
        {course.shapeName}
      </span>
    </div>
  );
};
