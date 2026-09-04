export default function HangerGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hangerGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a97c2f" />
          <stop offset="45%" stopColor="#f1d989" />
          <stop offset="100%" stopColor="#caa14b" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="38" r="12" stroke="url(#hangerGold)" strokeWidth="3" />
      <path d="M100 50 L100 66" stroke="url(#hangerGold)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M100 66 C100 66 100 78 112 84 L172 116 C182 121 180 136 168 136 L32 136 C20 136 18 121 28 116 L88 84 C100 78 100 66 100 66 Z"
        stroke="url(#hangerGold)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="60" y1="136" x2="60" y2="150" stroke="url(#hangerGold)" strokeWidth="2" opacity="0.5" />
      <line x1="140" y1="136" x2="140" y2="150" stroke="url(#hangerGold)" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
