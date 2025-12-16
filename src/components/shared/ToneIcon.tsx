/**
 * ToneIcon - SVG tone mark icons for Chinese tones 1-4
 */

interface ToneIconProps {
  tone: number;
  className?: string;
  size?: number;
}

export default function ToneIcon({ tone, className, size = 32 }: ToneIconProps) {
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 32 32',
    className,
    'aria-label': `Tone ${tone}`,
  };

  switch (tone) {
    case 1: // Flat/high tone - horizontal line (macron)
      return (
        <svg {...svgProps}>
          <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 2: // Rising tone - line going up
      return (
        <svg {...svgProps}>
          <line x1="4" y1="22" x2="28" y2="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 3: // Dipping tone - V shape (caron)
      return (
        <svg {...svgProps}>
          <polyline points="4,12 16,24 28,12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 4: // Falling tone - line going down
      return (
        <svg {...svgProps}>
          <line x1="4" y1="10" x2="28" y2="22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
