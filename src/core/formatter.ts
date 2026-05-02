const grouper = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 10,
  useGrouping: true,
});

export function formatNumberString(raw: string): string {
  if (!raw) return raw;
  const negative = raw.startsWith('-');
  const body = negative ? raw.slice(1) : raw;
  if (body === '' || body === '.') return raw;
  const [intPartRaw, fracPart] = body.split('.');
  const intPart = intPartRaw ?? '';
  const intNum = Number(intPart || '0');
  if (!Number.isFinite(intNum)) return raw;
  const groupedInt = grouper.format(intNum);
  const result = fracPart !== undefined ? `${groupedInt}.${fracPart}` : groupedInt;
  return negative ? '-' + result : result;
}

export function formatExpression(expression: string): string {
  if (!expression) return '';
  return expression.replace(/(-?\d+\.?\d*)/g, (token) => formatNumberString(token));
}

export function fontSizeForLength(length: number): string {
  if (length <= 8) return 'text-display';
  if (length <= 12) return 'text-display-md';
  if (length <= 16) return 'text-display-sm';
  return 'text-display-xs';
}
