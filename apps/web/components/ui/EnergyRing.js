'use client';

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// Outer ring: energy (coral), inner ring: protein (green)
// r=62 → circumference=389.56; r=44 → circumference=276.46
export default function EnergyRing({
  energyProgress = 0,
  proteinProgress = 0,
  size = 160,
  strokeWidth = 10,
  children,
}) {
  const center = size / 2;
  const outerR = 62 * (size / 160);
  const innerR = 44 * (size / 160);
  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;
  const outerOffset = outerC * (1 - clamp(energyProgress, 0, 1));
  const innerOffset = innerC * (1 - clamp(proteinProgress, 0, 1));
  const sw = strokeWidth * (size / 160);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* track rings */}
        <circle cx={center} cy={center} r={outerR} fill="none" stroke="#F5EDE9" strokeWidth={sw} />
        <circle cx={center} cy={center} r={innerR} fill="none" stroke="#E8F8EF" strokeWidth={sw} />
        {/* progress rings */}
        <circle
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
        <circle
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
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
