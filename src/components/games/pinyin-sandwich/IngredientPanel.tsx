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

const TONE_MARKS: Record<number, string> = {
  1: 'ˉ',
  2: 'ˊ',
  3: 'ˇ',
  4: 'ˋ',
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
  const getDisplayValue = (value: string | number): string => {
    if (type === 'tone' && typeof value === 'number') {
      return TONE_MARKS[value] || String(value);
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
