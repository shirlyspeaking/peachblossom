import type { SpeciesId } from '../types'

interface FlowerPlaceholderProps {
  species: SpeciesId
  accentHex: string
  size?: number
}

/** Procedural blossom silhouette — works without raster assets. */
export function FlowerPlaceholder({
  species,
  accentHex,
  size = 120,
}: FlowerPlaceholderProps) {
  const stroke = 'rgba(44,40,36,0.35)'
  if (species === 'lotus') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <ellipse cx="50" cy="72" rx="6" ry="28" fill="#5a7a62" opacity={0.85} />
        <g transform="translate(50 48)">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              rx="22"
              ry="10"
              fill={accentHex}
              opacity={0.92}
              stroke={stroke}
              strokeWidth={0.6}
              transform={`rotate(${deg}) translate(0 -14)`}
            />
          ))}
          <circle r="10" fill="#f4d7a6" opacity={0.9} stroke={stroke} strokeWidth={0.5} />
        </g>
      </svg>
    )
  }
  if (species === 'plum') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <path
          d="M20 78 Q 45 52 72 22"
          fill="none"
          stroke="#6a4a3a"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={38 + i * 12}
            cy={38 + i * -6}
            r={7 + i}
            fill={accentHex}
            stroke={stroke}
            strokeWidth={0.5}
            opacity={0.95}
          />
        ))}
      </svg>
    )
  }
  if (species === 'magnolia') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <path
          d="M28 82 Q 48 44 62 18"
          fill="none"
          stroke="#7a6248"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <g transform="translate(54 34) rotate(-18)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              rx="20"
              ry="8"
              fill={accentHex}
              opacity={0.9}
              stroke={stroke}
              strokeWidth={0.5}
              transform={`rotate(${deg}) translate(0 -10)`}
            />
          ))}
        </g>
      </svg>
    )
  }
  // peony default
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <ellipse cx="48" cy="78" rx="5" ry="24" fill="#6d7a54" opacity={0.75} />
      <g transform="translate(48 42)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <path
            key={deg}
            d="M0 0 C 6 -18 22 -22 26 -10 C 18 4 6 10 0 0z"
            fill={accentHex}
            opacity={0.9}
            stroke={stroke}
            strokeWidth={0.4}
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="11" fill="#5a1f1f" opacity={0.35} />
      </g>
    </svg>
  )
}
