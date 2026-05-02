export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  createdAt: number;
}

export interface ThemeColors {
  bg: string;
  btn_num: string;
  btn_op: string;
  btn_accent: string;
  text: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export type CalcKey =
  | { kind: 'digit'; value: string }
  | { kind: 'op'; value: '+' | '-' | '*' | '/' }
  | { kind: 'paren'; value: '(' | ')' }
  | { kind: 'dot' }
  | { kind: 'percent' }
  | { kind: 'sign' }
  | { kind: 'equals' }
  | { kind: 'clear' }
  | { kind: 'delete' };

export type EvaluationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };
