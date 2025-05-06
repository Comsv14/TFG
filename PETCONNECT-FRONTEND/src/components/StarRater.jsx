import { useState } from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

/**
 * value        → número (media o nota propia)
 * onRate(score)→ callback cuando el usuario elige puntuación
 * disabled     → no permite clic
 * readOnly     → sólo muestra, sin hover/clic
 */
export default function StarRater({ value = 0, onRate, disabled = false, readOnly = false }) {
  const [hover, setHover] = useState(null);

  const shown = hover ?? value;

  function handle(rate) {
    if (disabled || readOnly) return;
    onRate?.(rate);
  }

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={clsx(
            'w-6 h-6 cursor-pointer transition-transform',
            shown >= star ? 'fill-current' : 'stroke-current',
            disabled || readOnly ? 'opacity-40 cursor-default' : 'hover:scale-110'
          )}
          onMouseEnter={() => !disabled && !readOnly && setHover(star)}
          onMouseLeave={() => setHover(null)}
          onClick={() => handle(star)}
        />
      ))}
    </div>
  );
}
