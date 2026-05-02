'use client';

import { Delete } from 'lucide-react';
import { CalcButton } from './CalcButton';
import { useCalculatorStore } from '@/store/useCalculatorStore';

export function Keypad() {
  const {
    pressDigit,
    pressOperator,
    pressDot,
    pressPercent,
    pressSign,
    pressEquals,
    pressClear,
    pressDelete,
  } = useCalculatorStore();

  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-3 px-4 pb-6 pt-2 w-full flex-1 min-h-0">
      <CalcButton variant="action" ariaLabel="All clear" onPress={pressClear}>
        AC
      </CalcButton>
      <CalcButton variant="action" ariaLabel="Toggle sign" onPress={pressSign}>
        +/−
      </CalcButton>
      <CalcButton variant="action" ariaLabel="Percent" onPress={pressPercent}>
        %
      </CalcButton>
      <CalcButton variant="op" ariaLabel="Divide" onPress={() => pressOperator('/')}>
        ÷
      </CalcButton>

      <CalcButton ariaLabel="Seven" onPress={() => pressDigit('7')}>7</CalcButton>
      <CalcButton ariaLabel="Eight" onPress={() => pressDigit('8')}>8</CalcButton>
      <CalcButton ariaLabel="Nine" onPress={() => pressDigit('9')}>9</CalcButton>
      <CalcButton variant="op" ariaLabel="Multiply" onPress={() => pressOperator('*')}>
        ×
      </CalcButton>

      <CalcButton ariaLabel="Four" onPress={() => pressDigit('4')}>4</CalcButton>
      <CalcButton ariaLabel="Five" onPress={() => pressDigit('5')}>5</CalcButton>
      <CalcButton ariaLabel="Six" onPress={() => pressDigit('6')}>6</CalcButton>
      <CalcButton variant="op" ariaLabel="Subtract" onPress={() => pressOperator('-')}>
        −
      </CalcButton>

      <CalcButton ariaLabel="One" onPress={() => pressDigit('1')}>1</CalcButton>
      <CalcButton ariaLabel="Two" onPress={() => pressDigit('2')}>2</CalcButton>
      <CalcButton ariaLabel="Three" onPress={() => pressDigit('3')}>3</CalcButton>
      <CalcButton variant="op" ariaLabel="Add" onPress={() => pressOperator('+')}>
        +
      </CalcButton>

      <CalcButton ariaLabel="Zero" onPress={() => pressDigit('0')}>0</CalcButton>
      <CalcButton ariaLabel="Decimal point" onPress={pressDot}>
        .
      </CalcButton>
      <CalcButton variant="action" ariaLabel="Backspace" onPress={pressDelete}>
        <Delete className="w-7 h-7" strokeWidth={2.5} />
      </CalcButton>
      <CalcButton variant="accent" ariaLabel="Equals" onPress={pressEquals}>
        =
      </CalcButton>
    </div>
  );
}
