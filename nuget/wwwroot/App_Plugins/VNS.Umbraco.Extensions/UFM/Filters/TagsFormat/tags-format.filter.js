import { UmbUfmFilterBase } from '@umbraco-cms/backoffice/ufm';
export class TagsFormatUfmFilter extends UmbUfmFilterBase {
    filter(value, ...args) {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        const outputSeparator = typeof args[0] === 'string' && args[0].length > 0 ? args[0] : ', ';
        const inputSeparator = typeof args[1] === 'string' && args[1].length > 0 ? args[1] : ',';
        const items = toTagItems(value, inputSeparator);
        return items.join(outputSeparator);
    }
}
function toTagItems(value, inputSeparator) {
    if (Array.isArray(value)) {
        return value
            .map((item) => extractTagText(item))
            .filter((item) => !!item);
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) {
            return [];
        }
        const jsonParsed = tryParseJson(trimmed);
        if (jsonParsed !== undefined) {
            return toTagItems(jsonParsed, inputSeparator);
        }
        if (trimmed.includes(inputSeparator)) {
            return trimmed
                .split(inputSeparator)
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
        }
        return [trimmed];
    }
    if (value && typeof value === 'object') {
        const objectValue = value;
        if (Array.isArray(objectValue.tags)) {
            return objectValue.tags
                .map((item) => extractTagText(item))
                .filter((item) => !!item);
        }
        const item = extractTagText(value);
        return item ? [item] : [];
    }
    return [];
}
function extractTagText(value) {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    if (value && typeof value === 'object') {
        const item = value;
        const candidates = [item.value, item.tag, item.text, item.name];
        for (const candidate of candidates) {
            if (typeof candidate === 'string') {
                const trimmed = candidate.trim();
                if (trimmed.length > 0) {
                    return trimmed;
                }
            }
        }
    }
    return null;
}
function tryParseJson(value) {
    const startsAsJson = value.startsWith('[') || value.startsWith('{');
    if (!startsAsJson) {
        return undefined;
    }
    try {
        return JSON.parse(value);
    }
    catch {
        return undefined;
    }
}
export { TagsFormatUfmFilter as api };
//# sourceMappingURL=tags-format.filter.js.map