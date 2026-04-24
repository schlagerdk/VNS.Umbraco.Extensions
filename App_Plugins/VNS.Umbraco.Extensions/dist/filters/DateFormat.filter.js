import { UmbUfmFilterBase } from '@umbraco-cms/backoffice/ufm';
const MONTH_YEAR_OPTIONS = {
    month: 'long',
    year: 'numeric'
};
const SHORT_OPTIONS = {
    dateStyle: 'short'
};
const LONG_OPTIONS = {
    dateStyle: 'long'
};
export class DateFormatUfmFilter extends UmbUfmFilterBase {
    filter(value, format) {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        const parsed = parseDateValue(value);
        if (!parsed.date) {
            return stringifyFallback(value);
        }
        const formatText = typeof format === 'string' && format.trim().length > 0 ? format.trim() : 'short';
        try {
            return formatDate(parsed.date, formatText, parsed.timeZone);
        }
        catch {
            return stringifyFallback(value);
        }
    }
}
function parseDateValue(value) {
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
function formatDate(date, format, timeZone) {
    const normalizedFormat = format.toLowerCase();
    const options = timeZone ? { timeZone } : undefined;
    if (normalizedFormat === 'short') {
        return new Intl.DateTimeFormat(undefined, { ...SHORT_OPTIONS, ...options }).format(date);
    }
    if (normalizedFormat === 'long') {
        return new Intl.DateTimeFormat(undefined, { ...LONG_OPTIONS, ...options }).format(date);
    }
    if (normalizedFormat === 'monthyear') {
        return new Intl.DateTimeFormat(undefined, { ...MONTH_YEAR_OPTIONS, ...options }).format(date);
    }
    return formatCustomDate(date, format, timeZone);
}
function formatCustomDate(date, format, timeZone) {
    const parts = getDateParts(date, timeZone);
    const tokenMap = {
        yyyy: parts.year,
        yy: parts.year.slice(-2),
        MMMM: parts.monthLong,
        MMM: parts.monthShort,
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
    return format.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|H|mm|m|ss|s/g, (token) => tokenMap[token] ?? token);
}
function getDateParts(date, timeZone) {
    const commonOptions = {
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
    return {
        year: getPart(dateParts, 'year'),
        month: getPart(dateParts, 'month'),
        day: getPart(dateParts, 'day'),
        hour: getPart(timeParts, 'hour'),
        minute: getPart(timeParts, 'minute'),
        second: getPart(timeParts, 'second'),
        monthShort,
        monthLong
    };
}
function getPart(parts, type) {
    const value = parts.find((part) => part.type === type)?.value;
    return value ?? '';
}
function isDateLikeObject(value) {
    return typeof value === 'object' && value !== null && ('date' in value || 'timeZone' in value);
}
function isValidDate(value) {
    return !Number.isNaN(value.getTime());
}
function parseDateString(value) {
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
function stringifyFallback(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value === null || value === undefined) {
        return '';
    }
    return String(value);
}
function normalizeDateString(value) {
    const trimmed = value.trim();
    // Normalize "yyyy-MM-dd HH:mm[:ss]" into ISO-like format.
    const withIsoSeparator = trimmed.replace(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2})?)/, '$1T$2');
    // Remove accidental whitespace before timezone offsets, e.g. "...T12:00:00 +02:00".
    return withIsoSeparator.replace(/\s+([zZ]|[+-]\d{2}:\d{2})$/, '$1');
}
function parseIsoLikeString(value) {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?(?:([zZ]|[+-]\d{2}:\d{2}))?$/);
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
function parseDanishLikeString(value) {
    const match = value.match(/^(\d{2})-(\d{2})-(\d{4})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!match) {
        return null;
    }
    const [, d, m, y, hh = '00', mm = '00', ss = '00'] = match;
    const localDate = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
    return isValidDate(localDate) ? localDate : null;
}
export { DateFormatUfmFilter as api };
//# sourceMappingURL=DateFormat.filter.js.map