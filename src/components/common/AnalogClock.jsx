// src/components/common/AnalogClock.jsx
import React, { useState, useEffect } from "react";

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time values (smooth fractions for fluid arcs)
  const ms = time.getMilliseconds();
  const secondsRaw = time.getSeconds();
  const minutesRaw = time.getMinutes();
  const hours24 = time.getHours();
  const hours = hours24 % 12;

  const seconds = secondsRaw + ms / 1000;
  const minutes = minutesRaw + seconds / 60;
  const hoursFrac = hours + minutes / 60;

  const secondPercent = (seconds / 60) * 100;
  const minutePercent = (minutes / 60) * 100;
  const hourPercent = (hoursFrac / 12) * 100;

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const clockSize = 200;
  const centerX = clockSize / 2;
  const centerY = clockSize / 2;
  const radius = clockSize / 2 - 18;

  const outerRadius = radius;
  const middleRadius = radius - 18;
  const innerRadius = radius - 36;

  // SVG arc generator
  const getArcPath = (cx, cy, r, startAngle, endAngle) => {
    const sweep = endAngle - startAngle;
    const safeEnd = sweep >= 360 ? endAngle - 0.01 : endAngle;
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (safeEnd - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArcFlag = safeEnd - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Dot at the leading edge of an arc
  const getArcEndPoint = (cx, cy, r, percent) => {
    const angle = (percent / 100) * 360 - 90;
    const rad = angle * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const hourTip = getArcEndPoint(centerX, centerY, outerRadius, hourPercent);
  const minTip = getArcEndPoint(centerX, centerY, middleRadius, minutePercent);
  const secTip = getArcEndPoint(centerX, centerY, innerRadius, secondPercent);

  // Minute ticks
  const tickData = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * 360 - 90;
    const rad = angle * (Math.PI / 180);
    const isMain = i % 5 === 0;
    const innerR = radius + 6;
    const outerR = radius + (isMain ? 13 : 9);
    tickData.push({
      x1: centerX + innerR * Math.cos(rad),
      y1: centerY + innerR * Math.sin(rad),
      x2: centerX + outerR * Math.cos(rad),
      y2: centerY + outerR * Math.sin(rad),
      isMain,
    });
  }

  // Hour numerals
  const hourLabels = [];
  for (let i = 0; i < 12; i++) {
    const num = i === 0 ? 12 : i;
    const angle = (i / 12) * 360 - 90;
    const rad = angle * (Math.PI / 180);
    const labelR = radius + 26;
    hourLabels.push({
      x: centerX + labelR * Math.cos(rad),
      y: centerY + labelR * Math.sin(rad) + 3.5,
      label: num,
      isHighlight: num === (hours === 0 ? 12 : hours),
    });
  }

  return (
    <div style={clockContainerStyle}>
      <svg
        width={clockSize + 60}
        height={clockSize + 110}
        viewBox={`-30 -30 ${clockSize + 60} ${clockSize + 110}`}
        style={svgStyle}
      >
        <defs>
          <radialGradient id="faceGrad" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#F5EDE0" />
            <stop offset="60%" stopColor="#E8DCC8" />
            <stop offset="100%" stopColor="#D4C4AE" />
          </radialGradient>

          <linearGradient id="hourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077C8" />
            <stop offset="100%" stopColor="#4A9BD4" />
          </linearGradient>
          <linearGradient id="minuteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F88379" />
            <stop offset="100%" stopColor="#FAA89F" />
          </linearGradient>
          <linearGradient id="secondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A373" />
            <stop offset="100%" stopColor="#E8C8A0" />
          </linearGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== FACE ===== */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 18}
          fill="url(#faceGrad)"
          stroke="#C8B8A0"
          strokeWidth="1.5"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 17}
          fill="none"
          stroke="#D4C4AE"
          strokeWidth="0.5"
          opacity="0.6"
        />

        {/* ===== MINUTE TICKS ===== */}
        {tickData.map((t, i) => (
          <line
            key={`tick-${i}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isMain ? "#4A3728" : "#8A7A6A"}
            strokeWidth={t.isMain ? 2 : 1}
            strokeLinecap="round"
            opacity={t.isMain ? 0.9 : 0.5}
          />
        ))}

        {/* ===== HOUR RING ===== */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="none"
          stroke="#E8DCC8"
          strokeWidth="7"
          opacity="0.6"
        />
        <path
          d={getArcPath(
            centerX,
            centerY,
            outerRadius,
            0,
            (hourPercent / 100) * 360,
          )}
          fill="none"
          stroke="url(#hourGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />
        <circle
          cx={hourTip.x}
          cy={hourTip.y}
          r="4.5"
          fill="#0077C8"
          filter="url(#dotGlow)"
        />

        {/* ===== MINUTE RING ===== */}
        <circle
          cx={centerX}
          cy={centerY}
          r={middleRadius}
          fill="none"
          stroke="#E8DCC8"
          strokeWidth="7"
          opacity="0.6"
        />
        <path
          d={getArcPath(
            centerX,
            centerY,
            middleRadius,
            0,
            (minutePercent / 100) * 360,
          )}
          fill="none"
          stroke="url(#minuteGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />
        <circle
          cx={minTip.x}
          cy={minTip.y}
          r="4.5"
          fill="#F88379"
          filter="url(#dotGlow)"
        />

        {/* ===== SECOND RING ===== */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="none"
          stroke="#E8DCC8"
          strokeWidth="7"
          opacity="0.6"
        />
        <path
          d={getArcPath(
            centerX,
            centerY,
            innerRadius,
            0,
            (secondPercent / 100) * 360,
          )}
          fill="none"
          stroke="url(#secondGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />
        <circle
          cx={secTip.x}
          cy={secTip.y}
          r="4.5"
          fill="#D4A373"
          filter="url(#dotGlow)"
        >
          <animate
            attributeName="r"
            values="4.5;6;4.5"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.6;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>

        {/* ===== HOUR NUMERALS ===== */}
        {hourLabels.map((l, i) => (
          <text
            key={`label-${i}`}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            fontSize={l.isHighlight ? 14 : 11}
            fontWeight={l.isHighlight ? 800 : 600}
            fill={l.isHighlight ? "#0077C8" : "#4A3728"}
            fontFamily="'Bungee', sans-serif"
            opacity={l.isHighlight ? 1 : 0.7}
            style={{
              transition: "all 0.3s ease",
              textShadow: l.isHighlight
                ? "0 0 12px rgba(0,119,200,0.3)"
                : "none",
            }}
          >
            {l.label}
          </text>
        ))}

        {/* ===== CENTER DIGITAL DISPLAY ===== */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          <circle
            cx="0"
            cy="0"
            r="30"
            fill="#FFFFFF"
            stroke="#D4C4AE"
            strokeWidth="1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="25"
            fill="none"
            stroke="#E8DCC8"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <text
            x="0"
            y="-2"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill="#4A3728"
            fontFamily="'Bungee', sans-serif"
            letterSpacing="0.5"
          >
            {String(hours || 12).padStart(2, "0")}:
            {String(minutesRaw).padStart(2, "0")}
          </text>
          <text
            x="0"
            y="13"
            textAnchor="middle"
            fontSize="9"
            fill="#D4A373"
            fontFamily="'Inter', sans-serif"
            letterSpacing="1.5"
            opacity="0.9"
          >
            {String(secondsRaw).padStart(2, "0")} {hours24 >= 12 ? "PM" : "AM"}
          </text>
        </g>

        {/* ===== DATE PILL ===== */}
        <g transform={`translate(${centerX}, ${centerY + radius + 46})`}>
          <rect
            x="-55"
            y="-12"
            width="110"
            height="24"
            rx="12"
            fill="#FFFFFF"
            stroke="#D4C4AE"
            strokeWidth="1"
          />
          <circle cx="-40" cy="0" r="3" fill="#0077C8" />
          <text
            x="6"
            y="4"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#4A3728"
            fontFamily="'Bungee', sans-serif"
            letterSpacing="0.5"
          >
            {formatDate(time)}
          </text>
        </g>

        {/* ===== LEGEND ===== */}
        <g transform={`translate(${centerX - 60}, ${centerY + radius + 75})`}>
          {[
            { x: 6, color: "#0077C8", label: "Hours" },
            { x: 46, color: "#F88379", label: "Minutes" },
            { x: 92, color: "#D4A373", label: "Seconds" },
          ].map((item, i) => (
            <g key={`leg-${i}`} transform={`translate(${item.x}, 0)`}>
              <circle cx="0" cy="0" r="3" fill={item.color} />
              <text
                x="6"
                y="3.5"
                fontSize="7.5"
                fill="#4A3728"
                fontFamily="'Inter', sans-serif"
                fontWeight="600"
              >
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

const clockContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 0",
  width: "100%",
};

const svgStyle = {
  filter: "drop-shadow(0 4px 16px rgba(180, 160, 140, 0.15))",
  maxWidth: "100%",
  height: "auto",
};

export default AnalogClock;
