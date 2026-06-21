// src/components/common/AnalogClock.jsx
// MatrixClock — a binary time matrix where each tile rotates in 3D as time passes.
// Rows = Hours / Minutes / Seconds. A tile flips active when its binary bit is 1.
// Brand palette only: Aegean Blue, Coral, Yellow, Green, Orange on cream.

import React, { useState, useEffect } from "react";

const COLORS = {
  cream: "#F5EDE0",
  creamDeep: "#E8DCC8",
  ink: "#4A3728",
  inkSoft: "#8A7A6A",
  blue: "#0077C8",
  coral: "#F88379",
  yellow: "#F2D24B",
  green: "#A9C632",
  orange: "#F39A1E",
};

// Each row maps to one brand color
const ROWS = [
  { key: "H", label: "HOURS", color: COLORS.blue },
  { key: "M", label: "MINUTES", color: COLORS.coral },
  { key: "S", label: "SECONDS", color: COLORS.yellow },
];

const COLS = 6; // 6 bits -> covers 0..59 for minutes/seconds, 0..23 for hours

const toBits = (val) => {
  const bits = [];
  for (let i = COLS - 1; i >= 0; i--) bits.push((val >> i) & 1);
  return bits; // most-significant bit first
};

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h24 = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const h12 = h24 % 12 || 12;

  const rowValues = { H: h24, M: m, S: s };

  const pad = (n) => String(n).padStart(2, "0");

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  // Column place values shown beneath the grid (binary weights)
  const placeValues = [32, 16, 8, 4, 2, 1];

  return (
    <div style={wrap}>
      <div style={panel}>
        {/* Header: live digital readout */}
        <div style={headerRow}>
          <div style={readout}>
            <span style={{ color: COLORS.blue }}>{pad(h12)}</span>
            <span style={colon}>:</span>
            <span style={{ color: COLORS.coral }}>{pad(m)}</span>
            <span style={colon}>:</span>
            <span style={{ color: COLORS.yellow }}>{pad(s)}</span>
          </div>
          <div style={ampm}>{h24 >= 12 ? "PM" : "AM"}</div>
        </div>

        {/* The matrix */}
        <div style={matrix}>
          {ROWS.map((row) => {
            const bits = toBits(rowValues[row.key]);
            return (
              <div key={row.key} style={matrixRow}>
                <div style={rowTag}>{row.key}</div>
                <div style={tilesWrap}>
                  {bits.map((bit, ci) => (
                    <Tile
                      key={ci}
                      active={bit === 1}
                      color={row.color}
                      // stagger so a roll-over ripples across the row
                      delay={ci * 55}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* place-value scale */}
          <div style={scaleRow}>
            <div style={{ width: 22 }} />
            <div style={tilesWrap}>
              {placeValues.map((p, i) => (
                <div key={i} style={scaleCell}>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: date + legend */}
        <div style={footer}>
          <div style={datePill}>
            <span style={{ ...dotBase, background: COLORS.green }} />
            {formatDate(time)}
          </div>
          <div style={legend}>
            {ROWS.map((r) => (
              <span key={r.key} style={legendItem}>
                <span style={{ ...dotBase, background: r.color }} />
                {r.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tileFlipOn {
          0%   { transform: rotateX(0deg) rotateY(0deg) scale(1); }
          50%  { transform: rotateX(90deg) rotateY(45deg) scale(1.12); }
          100% { transform: rotateX(0deg) rotateY(0deg) scale(1); }
        }
        @keyframes tileFlipOff {
          0%   { transform: rotateX(0deg) rotateY(0deg) scale(1); }
          50%  { transform: rotateX(-90deg) rotateY(-45deg) scale(0.92); }
          100% { transform: rotateX(0deg) rotateY(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

// ---- Single matrix tile: rotates in 3D whenever its active-state changes ----
const Tile = ({ active, color, delay }) => {
  const [spin, setSpin] = useState(false);
  const [prev, setPrev] = useState(active);

  useEffect(() => {
    if (active !== prev) {
      setSpin(true);
      setPrev(active);
      const t = setTimeout(() => setSpin(false), 600 + delay);
      return () => clearTimeout(t);
    }
  }, [active, prev, delay]);

  const tileStyle = {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: active ? color : "transparent",
    border: active ? `2px solid ${color}` : `2px solid ${COLORS.creamDeep}`,
    boxShadow: active
      ? `0 4px 12px ${color}55, inset 0 1px 2px rgba(255,255,255,0.4)`
      : "inset 0 1px 2px rgba(180,160,140,0.15)",
    transformStyle: "preserve-3d",
    transition:
      "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
    animation: spin
      ? `${active ? "tileFlipOn" : "tileFlipOff"} 0.6s ease ${delay}ms both`
      : "none",
  };

  return (
    <div style={{ perspective: 200 }}>
      <div style={tileStyle} />
    </div>
  );
};

// ---------------- styles ----------------
const wrap = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "6px 0",
};

const panel = {
  background: COLORS.cream,
  border: `1.5px solid ${COLORS.creamDeep}`,
  borderRadius: 20,
  padding: "20px 22px",
  boxShadow: "0 8px 28px rgba(180,160,140,0.18)",
  fontFamily: "'Inter', sans-serif",
  display: "inline-block",
};

const headerRow = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  marginBottom: 16,
};

const readout = {
  fontFamily: "'Bungee', sans-serif",
  fontSize: 28,
  letterSpacing: 1,
  lineHeight: 1,
};

const colon = { color: COLORS.inkSoft, margin: "0 2px" };

const ampm = {
  fontFamily: "'Bungee', sans-serif",
  fontSize: 12,
  color: COLORS.green,
  letterSpacing: 1,
};

const matrix = { display: "flex", flexDirection: "column", gap: 10 };

const matrixRow = { display: "flex", alignItems: "center", gap: 10 };

const rowTag = {
  width: 22,
  textAlign: "center",
  fontFamily: "'Bungee', sans-serif",
  fontSize: 13,
  color: COLORS.ink,
};

const tilesWrap = { display: "flex", gap: 8 };

const scaleRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 2,
};

const scaleCell = {
  width: 34,
  textAlign: "center",
  fontSize: 9,
  color: COLORS.inkSoft,
  fontWeight: 600,
  letterSpacing: 0.5,
};

const footer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  marginTop: 18,
  flexWrap: "wrap",
};

const datePill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "#FFFFFF",
  border: `1px solid ${COLORS.creamDeep}`,
  borderRadius: 20,
  padding: "6px 14px",
  fontFamily: "'Bungee', sans-serif",
  fontSize: 11,
  color: COLORS.ink,
};

const legend = { display: "flex", gap: 12, flexWrap: "wrap" };

const legendItem = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 9,
  fontWeight: 600,
  color: COLORS.ink,
  letterSpacing: 0.5,
};

const dotBase = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  display: "inline-block",
};

export default AnalogClock;
