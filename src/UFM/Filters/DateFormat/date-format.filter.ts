import { UmbUfmFilterBase } from '@umbraco-cms/backoffice/ufm';

type DateLikeObject = {
  date?: unknown;
  timeZone?: unknown;
};

const MONTH_YEAR_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'long',
  year: 'numeric'
};

const SHORT_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: 'short'
};

const LONG_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: 'long'
};

export class DateFormatUfmFilter extends UmbUfmFilterBase {
  override filter(value: unknown, ...args: unknown[]): string | null | undefined {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const parsed = parseDateValue(value);
    if (!parsed.date) {
      return stringifyFallback(value);
    }

    // UFM splits on ':' so 'HH:mm' arrives as two separate args ['HH', 'mm']
    // Join them back with ':' to reconstruct the intended format string
    const formatText = args.length > 0
      ? args.map(String).join(':').trim()
      : 'short';

    try {
      return formatDate(parsed.date, formatText, parsed.timeZone);
    } catch {
      return stringifyFallback(value);
    }
  }
}

function parseDateValue(value: unknown): { date: Date | null; timeZone?: string } {
  if (value instanceof Date) {
    return { date: isValidDate(value) ? value : null };
  }

  if (typeof value === 'string') {
    const date = parseDateString(value);
    return { date: isValidDate(date) ? date : null };
  }

  if (isDateLikeObject(value)) {
    const rawDate = value.date;
    const timeZone = typeof value.timeZone === 'string' ? value.timeZone : undefined;

    if (rawDate instanceof Date) {
      return { date: isValidDate(rawDate) ? rawDate : null, timeZone };
    }

    if (typeof rawDate === 'string' || typeof rawDate === 'number') {
      const date = typeof rawDate === 'string' ? parseDateString(rawDate) : new Date(rawDate);
      return { date: isValidDate(date) ? date : null, timeZone };
    }
  }

  return { date: null };
}

function formatDate(date: Date, format: string, timeZone?: string): string {
  const normalizedFormat = format.toLowerCase();
  const options = timeZone ? { timeZone } : undefined;

  if (normalizedFormat === 'short') {
    return new Intl.DateTimeFormat(undefined, { ...SHORT_OPTIONS, ...options }).format(date);
  }

  if (normalizedFormat === 'long') {
    return new Intl.DateTimeFormat(undefined, { ...LONG_OPTIONS, ...options }).format(date);
  }

  if (normalizedFormat === 'monthyear') {
    return formatMonthYearTitleCase(date, timeZone);
  }

  if (normalizedFormat === 'monthname') {
    return getDateParts(date, timeZone).monthLong;
  }

  if (normalizedFormat === 'weekdayname') {
    return getDateParts(date, timeZone).weekdayLong;
  }

  if (normalizedFormat === 'weeknumber' || normalizedFormat === 'week') {
    return getDateParts(date, timeZone).week;
  }

  return formatCustomDate(date, format, timeZone);
}

function formatCustomDate(date: Date, format: string, timeZone?: string): string {
  const parts = getDateParts(date, timeZone);

  const tokenMap: Record<string, string> = {
    yyyy: parts.year,
    yy: parts.year.slice(-2),
    MMMM: parts.monthLong,
    MMM: parts.monthShort,
    dddd: parts.weekdayLong,
    ddd: parts.weekdayShort,
    ww: parts.week,
    w: String(Number(parts.week)),
    MM: parts.month,
    M: String(Number(parts.month)),
    dd: parts.day,
    d: String(Number(parts.day)),
    HH: parts.hour,
    H: String(Number(parts.hour)),
    mm: parts.minute,
    m: String(Number(parts.minute)),
    ss: parts.second,
    s: String(Number(parts.second))
  };

  return format.replace(/yyyy|yy|MMMM|MMM|dddd|ddd|ww|w|MM|M|dd|d|HH|H|mm|m|ss|s/g, (token) => tokenMap[token] ?? token);
}

function getDateParts(date: Date, timeZone?: string): {
  year: string;
  month: string;
  monthShort: string;
  monthLong: string;
  weekdayShort: string;
  weekdayLong: string;
  week: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
} {
  const commonOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    hour12: false
  };

  const dateParts = new Intl.DateTimeFormat('en-GB', {
    ...commonOptions,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const timeParts = new Intl.DateTimeFormat('en-GB', {
    ...commonOptions,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).formatToParts(date);

  const monthShort = new Intl.DateTimeFormat(undefined, {
    timeZone,
    month: 'short'
  }).format(date);

  const monthLong = new Intl.DateTimeFormat(undefined, {
    timeZone,
    month: 'long'
  }).format(date);

  const weekdayShort = new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: 'short'
  }).format(date);

  const weekdayLong = new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: 'long'
  }).format(date);

  const year = getPart(dateParts, 'year');
  const month = getPart(dateParts, 'month');
  const day = getPart(dateParts, 'day');
  const week = getIsoWeekNumber(Number(year), Number(month), Number(day));

  return {
    year,
    month,
    day,
    hour: getPart(timeParts, 'hour'),
    minute: getPart(timeParts, 'minute'),
    second: getPart(timeParts, 'second'),
    monthShort: toTitleCase(monthShort),
    monthLong: toTitleCase(monthLong),
    weekdayShort: toTitleCase(weekdayShort),
    weekdayLong: toTitleCase(weekdayLong),
    week: String(week).padStart(2, '0')
  };
}

function getIsoWeekNumber(year: number, month: number, day: number): number {
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = utcDate.getUTCDay() || 7;

  // Shift to Thursday to determine ISO week in year boundaries.
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - weekday);

  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function toTitleCase(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

function formatMonthYearTitleCase(date: Date, timeZone?: string): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    ...MONTH_YEAR_OPTIONS,
    ...(timeZone ? { timeZone } : undefined)
  });

  const parts = formatter.formatToParts(date);
  return parts
    .map((part) => (part.type === 'month' ? toTitleCase(part.value) : part.value))
    .join('');
}

function getPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  const value = parts.find((part) => part.type === type)?.value;
  return value ?? '';
}

function isDateLikeObject(value: unknown): value is DateLikeObject {
  return typeof value === 'object' && value !== null && ('date' in value || 'timeZone' in value);
}

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

function parseDateString(value: string): Date {
  const direct = new Date(value);
  if (isValidDate(direct)) {
    return direct;
  }

  const normalized = normalizeDateString(value);
  const normalizedDate = new Date(normalized);
  if (isValidDate(normalizedDate)) {
    return normalizedDate;
  }

  const fromIsoLike = parseIsoLikeString(normalized);
  if (fromIsoLike) {
    return fromIsoLike;
  }

  const fromDanishLike = parseDanishLikeString(normalized);
  if (fromDanishLike) {
    return fromDanishLike;
  }

  return new Date(Number.NaN);
}

function stringifyFallback(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function normalizeDateString(value: string): string {
  const trimmed = value.trim();

  // Normalize "yyyy-MM-dd HH:mm[:ss]" into ISO-like format.
  const withIsoSeparator = trimmed.replace(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2})?)/,
    '$1T$2'
  );

  // Remove accidental whitespace before timezone offsets, e.g. "...T12:00:00 +02:00".
  return withIsoSeparator.replace(/\s+([zZ]|[+-]\d{2}:\d{2})$/, '$1');
}

function parseIsoLikeString(value: string): Date | null {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?(?:([zZ]|[+-]\d{2}:\d{2}))?$/
  );
  if (!match) {
    return null;
  }

  const [, y, m, d, hh = '00', mm = '00', ss = '00', tz] = match;

  if (tz) {
    const utcDate = new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}${tz}`);
    return isValidDate(utcDate) ? utcDate : null;
  }

  const localDate = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
  return isValidDate(localDate) ? localDate : null;
}

function parseDanishLikeString(value: string): Date | null {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!match) {
    return null;
  }

  const [, d, m, y, hh = '00', mm = '00', ss = '00'] = match;
  const localDate = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
  return isValidDate(localDate) ? localDate : null;
}

export { DateFormatUfmFilter as api };
