import React, { useEffect, useRef } from 'react';

interface CalendarProps {
  mode: 'single' | 'range';
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  mode,
  selected,
  onSelect,
  disabled,
  initialFocus,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (initialFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [initialFocus]);

  const handleClick = () => {
    const dateToSelect = selected || new Date();
    if (!disabled || (disabled && !disabled(dateToSelect))) {
      onSelect(dateToSelect);
    }
  };

  return (
    <div className="border rounded p-4">
      <p>Calendar mode: {mode}</p>
      <p>Selected date: {selected ? selected.toDateString() : 'None'}</p>
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled ? disabled(selected || new Date()) : false}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Select Date
      </button>
    </div>
  );
};
