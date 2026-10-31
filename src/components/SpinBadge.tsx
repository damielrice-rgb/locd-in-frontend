// SpinBadge.tsx — the round black "BOOK NOW ✷ ST. LOUIS LOCS" sticker that spins.
// textPath bends the text around an invisible circle.

export default function SpinBadge({ className = '' }: { className?: string }) {
  return (
    <svg className={`spin-slow ${className}`} width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
      <defs>
        {/* the invisible circle the letters follow */}
        <path id="badge-circle" d="M66 66 m-50 0 a50 50 0 1 1 100 0 a50 50 0 1 1 -100 0" />
      </defs>
      <circle cx="66" cy="66" r="64" fill="#0C0809" />
      <text fill="#FFFFFF" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 12.5, letterSpacing: 3.2 }}>
        <textPath href="#badge-circle">BOOK NOW ✷ ST. LOUIS LOCS ✷ LOC'D IN ✷</textPath>
      </text>
    </svg>
  );
}
