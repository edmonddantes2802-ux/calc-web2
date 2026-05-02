'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { formatExpression, formatNumberString, fontSizeForLength } from '@/core/formatter';
import { getGhostResult, prettify } from '@/core/calculator';

export function Display() {
  const { expression, result, error } = useCalculatorStore();

  const prettyExpression = formatExpression(prettify(expression));
  const ghost = !result && !error ? getGhostResult(expression) : null;
  const displayValue = error
    ? error
    : result !== null
      ? formatNumberString(result)
      : expression
        ? prettyExpression
        : '0';

  const sizeClass = fontSizeForLength(displayValue.length);

  return (
    <section className="flex flex-col justify-end items-end px-6 pt-8 pb-6 w-full overflow-hidden shrink-0 min-h-[28svh]">
      <div
        aria-live="polite"
        className="text-bold-textSecondary text-2xl font-medium min-h-[2rem] w-full text-right truncate"
      >
        {result !== null && expression ? prettyExpression : ghost ? `= ${formatNumberString(ghost)}` : ' '}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={displayValue + (error ? '-err' : '')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={[
            'w-full text-right font-black tracking-tight break-all',
            sizeClass,
            error ? 'text-bold-error animate-shake' : 'text-bold-textPrimary',
          ].join(' ')}
        >
          {displayValue}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
