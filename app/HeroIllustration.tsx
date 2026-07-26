export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 360 360"
      width="100%"
      height="100%"
      style={{ maxWidth: 360 }}
      aria-hidden="true"
    >
      <circle cx="180" cy="180" r="170" fill="#dbeafe" />
      <circle cx="70" cy="80" r="26" fill="#fde68a" opacity="0.9" />
      <circle cx="305" cy="270" r="20" fill="#bbf7d0" opacity="0.9" />
      <circle cx="300" cy="70" r="14" fill="#fca5a5" opacity="0.8" />

      {/* phone */}
      <rect x="110" y="40" width="150" height="280" rx="24" fill="#ffffff" stroke="#1e3a8a" strokeWidth="3" />
      <rect x="122" y="60" width="126" height="240" rx="10" fill="#f1f5f9" />

      {/* customer chat bubble */}
      <rect x="130" y="76" width="92" height="34" rx="12" fill="#e2e8f0" />
      <text x="176" y="97" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fill="#334155">
        写真を送ります📷
      </text>

      {/* AI reply bubble */}
      <rect x="138" y="118" width="100" height="46" rx="12" fill="#2563eb" />
      <text x="188" y="137" fontSize="10.5" fontFamily="sans-serif" textAnchor="middle" fill="#ffffff">
        ありがとうございます!
      </text>
      <text x="188" y="151" fontSize="10.5" fontFamily="sans-serif" textAnchor="middle" fill="#ffffff">
        担当より折り返します
      </text>

      {/* job card */}
      <rect x="134" y="178" width="112" height="96" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="150" cy="196" r="6" fill="#16a34a" />
      <text x="162" y="200" fontSize="10" fontFamily="sans-serif" fill="#334155">
        案件No.12
      </text>
      <text x="145" y="218" fontSize="10.5" fontFamily="sans-serif" fill="#111827" fontWeight="700">
        水漏れ修理
      </text>
      <text x="145" y="234" fontSize="9.5" fontFamily="sans-serif" fill="#64748b">
        7/28 14:00〜
      </text>
      <rect x="145" y="244" width="90" height="18" rx="9" fill="#d1fae5" />
      <text x="190" y="256.5" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fill="#065f46">
        作業完了
      </text>

      {/* home indicator */}
      <rect x="165" y="306" width="40" height="4" rx="2" fill="#94a3b8" />
    </svg>
  );
}
