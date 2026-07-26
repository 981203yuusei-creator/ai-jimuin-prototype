type IconProps = { size?: number; color?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
});

export function ChatIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <path
        d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5H9l-4 3.5v-3.5H5.5C4.67 15.5 4 14.83 4 14v-8.5Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.3" cy="9.7" r="1" fill={color} />
      <circle cx="12" cy="9.7" r="1" fill={color} />
      <circle cx="15.7" cy="9.7" r="1" fill={color} />
    </svg>
  );
}

export function PhoneIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <path
        d="M6.6 3.5h2.2l1.2 3.4-1.7 1.6a11.5 11.5 0 0 0 5.2 5.2l1.6-1.7 3.4 1.2v2.2a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 5.1 5.1a1.5 1.5 0 0 1 1.5-1.6Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ListIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M7 9h10M7 12.5h10M7 16h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 13.5h2M11.5 13.5h2M15 13.5h2M8 16.5h2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ShareIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="6" cy="12" r="2.2" stroke={color} strokeWidth="1.6" />
      <circle cx="17.5" cy="6" r="2.2" stroke={color} strokeWidth="1.6" />
      <circle cx="17.5" cy="18" r="2.2" stroke={color} strokeWidth="1.6" />
      <path d="M8 11l7.7-4M8 13l7.7 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ClipboardCheckIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="5" y="4.5" width="14" height="16" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M9 4.2h6a1 1 0 0 1 1 1v1.3H8V5.2a1 1 0 0 1 1-1Z" stroke={color} strokeWidth="1.6" />
      <path d="M8.5 13.2l2 2 4-4.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocumentIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <path
        d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3.5v4h4" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18.5h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ChartIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 20V5M4 20h16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="7" y="13" width="2.6" height="5" rx="0.5" fill={color} />
      <rect x="11.7" y="9" width="2.6" height="9" rx="0.5" fill={color} />
      <rect x="16.4" y="6" width="2.6" height="12" rx="0.5" fill={color} />
    </svg>
  );
}

export function CameraIcon({ size = 28, color = "#2563eb" }: IconProps) {
  return (
    <svg {...base(size)}>
      <path
        d="M4 8.5a1.5 1.5 0 0 1 1.5-1.5h1.8l1-1.6h7.4l1 1.6h1.8A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.1" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, color = "#16a34a" }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
      <path d="M8 12.3l2.5 2.5L16 9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkleIcon({ size = 22, color = "#f59e0b" }: IconProps) {
  return (
    <svg {...base(size)}>
      <path
        d="M12 3l1.6 4.9L18.5 9.5l-4.9 1.6L12 16l-1.6-4.9L5.5 9.5l4.9-1.6L12 3Z"
        fill={color}
      />
    </svg>
  );
}
