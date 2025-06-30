import React from 'react';

const ProgressBar = ({ progress, size, strokeWidth, color }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="progress-bar-svg" width={size} height={size}>
      <circle className="progress-bar-bg" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
      <circle
        className="progress-bar-fg"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

export default ProgressBar; 