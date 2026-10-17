export const qi = (year: number, quarter: number) => (year - 2015) * 4 + (quarter - 1);

export const qYear = (q: number) => 2015 + Math.floor(q / 4);
export const qNum = (q: number) => (q % 4) + 1;
export const qLabel = (q: number) => `Q${qNum(q)} '${String(qYear(q)).slice(2)}`;

export function money(n: number, sign = false): string {
  const neg = n < 0;
  const a = Math.abs(n);
  let s: string;
  if (a >= 1e9) s = `$${trim(a / 1e9)}B`;
  else if (a >= 1e6) s = `$${trim(a / 1e6)}M`;
  else if (a >= 1e3) s = `$${trim(a / 1e3)}k`;
  else s = `$${Math.round(a)}`;
  if (neg) return `-${s}`;
  return sign ? `+${s}` : s;
}

export function num(n: number, sign = false): string {
  const neg = n < 0;
  const a = Math.abs(n);
  let s: string;
  if (a >= 1e9) s = `${trim(a / 1e9)}B`;
  else if (a >= 1e6) s = `${trim(a / 1e6)}M`;
  else if (a >= 1e4) s = `${trim(a / 1e3)}k`;
  else s = `${Math.round(a).toLocaleString('en-US')}`;
  if (neg) return `-${s}`;
  return sign ? `+${s}` : s;
}

function trim(x: number): string {
  if (x >= 100) return Math.round(x).toString();
  if (x >= 10) return (Math.round(x * 10) / 10).toString();
  return (Math.round(x * 100) / 100).toString();
}

export const clamp = (x: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));

export function roundNice(n: number): number {
  if (n <= 0) return 0;
  const mag = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return Math.round(n / mag) * mag;
}
