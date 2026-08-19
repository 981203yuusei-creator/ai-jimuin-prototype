"use client";

import { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
  autoComplete,
  autoFocus,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required
        style={{ ...style, paddingRight: 56 }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        style={{
          position: "absolute",
          right: 4,
          top: "50%",
          transform: "translateY(-50%)",
          padding: "4px 8px",
          fontSize: 12,
          border: "none",
          background: "transparent",
          color: "#555",
          cursor: "pointer",
        }}
      >
        {visible ? "隠す" : "表示"}
      </button>
    </div>
  );
}
