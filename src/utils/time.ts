export type TimeValue = { hours: number; minutes: number; seconds: number };

export const ZERO_TIME: TimeValue = { hours: 0, minutes: 0, seconds: 0 };

export function toSeconds(t: TimeValue): number {
  return t.hours * 3600 + t.minutes * 60 + t.seconds;
}

export function fromSeconds(total: number): TimeValue {
  const s = Math.max(0, Math.round(total));
  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function formatTime(t: TimeValue): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;
}
