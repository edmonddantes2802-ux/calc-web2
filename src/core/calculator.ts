import { create, all, type MathJsInstance, type FactoryFunctionMap } from 'mathjs';
import type { EvaluationResult } from '@/types';

let mathInstance: MathJsInstance | null = null;

function math(): MathJsInstance {
  if (!mathInstance) {
    mathInstance = create(all as FactoryFunctionMap, { precision: 14 });
  }
  return mathInstance;
}

const OPERATORS = new Set(['+', '-', '*', '/']);
const TRAILING_OP_RE = /[+\-*/.]$/;

export function isOperator(ch: string): boolean {
  return OPERATORS.has(ch);
}

export function normalizeForEval(input: string): string {
  return input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
}

export function prettify(input: string): string {
  return input.replace(/\*/g, '×').replace(/\//g, '÷');
}

export function evaluateExpression(expression: string): EvaluationResult {
  const expr = normalizeForEval(expression).trim();
  if (!expr) return { ok: false, error: 'Empty' };
  if (TRAILING_OP_RE.test(expr)) return { ok: false, error: 'Incomplete' };
  if (/\/\s*0(?!\d|\.)/.test(expr)) return { ok: false, error: 'Cannot divide by zero' };

  try {
    const raw = math().evaluate(expr);
    if (typeof raw === 'number') {
      if (!Number.isFinite(raw)) return { ok: false, error: 'Cannot divide by zero' };
      return { ok: true, value: stringifyNumber(raw) };
    }
    if (typeof raw === 'bigint') return { ok: true, value: raw.toString() };
    if (raw && typeof raw === 'object' && 'toString' in raw) {
      return { ok: true, value: String(raw) };
    }
    return { ok: false, error: 'Invalid Format' };
  } catch {
    return { ok: false, error: 'Invalid Format' };
  }
}

function stringifyNumber(n: number): string {
  const rounded = Math.round(n * 1e10) / 1e10;
  return rounded.toString();
}

export function appendDigit(current: string, digit: string): string {
  if (current === '0') return digit;
  if (current === '-0') return '-' + digit;
  const lastNumber = getLastNumberToken(current);
  if (lastNumber === '0') {
    return current.slice(0, -1) + digit;
  }
  return current + digit;
}

export function appendOperator(current: string, op: string): string {
  if (!current) {
    return op === '-' ? '-' : '';
  }
  const last = current.slice(-1);
  if (isOperator(last)) {
    if (current.length >= 2 && isOperator(current.slice(-2, -1)) && op === '-') {
      return current;
    }
    return current.slice(0, -1) + op;
  }
  if (last === '.') {
    return current.slice(0, -1) + op;
  }
  if (last === '(') {
    return op === '-' ? current + op : current;
  }
  return current + op;
}

export function appendDot(current: string): string {
  if (!current) return '0.';
  const last = current.slice(-1);
  if (last === '.') return current;
  if (isOperator(last) || last === '(') return current + '0.';
  const lastNumber = getLastNumberToken(current);
  if (lastNumber.includes('.')) return current;
  return current + '.';
}

export function appendParen(current: string, paren: '(' | ')'): string {
  if (paren === '(') {
    if (!current) return '(';
    const last = current.slice(-1);
    if (last === ')' || /\d/.test(last)) return current + '*(';
    return current + '(';
  }
  if (!current) return current;
  const opens = (current.match(/\(/g) || []).length;
  const closes = (current.match(/\)/g) || []).length;
  if (opens <= closes) return current;
  const last = current.slice(-1);
  if (isOperator(last) || last === '(' || last === '.') return current;
  return current + ')';
}

export function applyPercent(current: string): string {
  if (!current) return current;
  const last = current.slice(-1);
  if (isOperator(last) || last === '.' || last === '(') return current;

  const tail = current.match(/(\d+\.?\d*|\.\d+)$/);
  if (!tail) return current;
  let cursor = current.length - tail[0].length;

  if (cursor > 0) {
    const sign = current.charAt(cursor - 1);
    if (sign === '+' || sign === '-') {
      const prev = cursor >= 2 ? current.charAt(cursor - 2) : '';
      if (cursor === 1 || prev === '(' || isOperator(prev)) {
        cursor -= 1;
      }
    }
  }

  const signedToken = current.slice(cursor);
  const numeric = Number(signedToken);
  if (!Number.isFinite(numeric)) return current;

  const before = current.slice(0, cursor);
  const ctxOp = before.charAt(before.length - 1);

  if (ctxOp === '+' || ctxOp === '-') {
    const baseExpr = before.slice(0, -1);
    if (baseExpr) {
      const evalRes = evaluateExpression(autoCloseParens(baseExpr));
      if (evalRes.ok) {
        const baseNum = Number(evalRes.value);
        if (Number.isFinite(baseNum)) {
          return before + stringifyNumber((baseNum * numeric) / 100);
        }
      }
    }
  }

  return before + stringifyNumber(numeric / 100);
}

export function toggleSign(current: string): string {
  if (!current) return '-';
  const token = getLastNumberToken(current);
  if (!token) return current;
  const start = current.length - token.length;
  const before = current.slice(0, start);
  if (before.endsWith('-') && (before.length === 1 || isOperator(before.slice(-2, -1)) || before.slice(-2, -1) === '(')) {
    return before.slice(0, -1) + token;
  }
  return before + '-' + token;
}

export function deleteLast(current: string): string {
  return current.slice(0, -1);
}

export function autoCloseParens(expression: string): string {
  const opens = (expression.match(/\(/g) || []).length;
  const closes = (expression.match(/\)/g) || []).length;
  const need = Math.max(0, opens - closes);
  return expression + ')'.repeat(need);
}

export function getGhostResult(expression: string): string | null {
  if (!expression) return null;
  const trimmed = expression.replace(/[+\-*/.]+$/, '');
  if (!trimmed) return null;
  if (!/[+\-*/]/.test(trimmed.slice(1))) return null;
  const closed = autoCloseParens(trimmed);
  const result = evaluateExpression(closed);
  return result.ok ? result.value : null;
}

function getLastNumberToken(input: string): string {
  const match = input.match(/(-?\d+\.?\d*|\.\d+)$/);
  return match?.[0] ?? '';
}
