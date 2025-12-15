/**
 * IngredientPanel - Selection panel for Initial, Final, or Tone
 */

interface IngredientPanelProps {
  type: 'initial' | 'final' | 'tone';
  label: string;
  options: (string | number)[];
  selected: string | number | null;
  onSelect: (value: string | number) => void;
  disabled?: boolean;
  correctValue?: string | number | null;
  showFeedback?: boolean;
}

// SVG tone mark icons - clean vector graphics for each tone
const ToneIcon = ({ tone, className }: { tone: number; className?: string }) => {
  const svgProps = {
    width: 32,
    height: 32,
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
};

export default function IngredientPanel({
  type,
  label,
  options,
  selected,
  onSelect,
  disabled = false,
  correctValue = null,
  showFeedback = false,
}: IngredientPanelProps) {
  const getDisplayValue = (value: string | number): string | JSX.Element => {
    if (type === 'tone' && typeof value === 'number') {
      return <ToneIcon tone={value} className="tone-icon" />;
    }
    // For initials/finals, show empty initial as "∅" or just the value
    if (type === 'initial' && value === '') {
      return '∅';
    }
    return String(value);
  };

  const getButtonClass = (value: string | number): string => {
    const classes = ['ingredient-btn', `ingredient-btn-${type}`];

    if (selected === value) {
      classes.push('selected');
    }

    if (showFeedback && correctValue !== null) {
      if (value === correctValue) {
        classes.push('correct');
      } else if (selected === value && value !== correctValue) {
        classes.push('incorrect');
      }
    }

    if (disabled) {
      classes.push('disabled');
    }

    return classes.join(' ');
  };

  return (
    <div className={`ingredient-panel ingredient-panel-${type}`}>
      <h3 className="ingredient-panel-label">{label}</h3>
      <div className="ingredient-options">
        {options.map((value, index) => (
          <button
            key={`${value}-${index}`}
            className={getButtonClass(value)}
            onClick={() => !disabled && onSelect(value)}
            disabled={disabled}
          >
            {getDisplayValue(value)}
          </button>
        ))}
      </div>
    </div>
  );
}
