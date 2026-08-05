export default function OnyxMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.3 L20.4 7.15 L20.4 16.85 L12 21.7 L3.6 16.85 L3.6 7.15 Z M12 7.8 L15.6 9.9 L15.6 14.1 L12 16.2 L8.4 14.1 L8.4 9.9 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M12 2.3 L12 7.8 M20.4 7.15 L15.6 9.9 M20.4 16.85 L15.6 14.1 M12 21.7 L12 16.2 M3.6 16.85 L8.4 14.1 M3.6 7.15 L8.4 9.9"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
