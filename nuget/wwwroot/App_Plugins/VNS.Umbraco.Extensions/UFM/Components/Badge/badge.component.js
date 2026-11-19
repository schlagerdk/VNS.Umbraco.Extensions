import { UmbUfmComponentBase } from '@umbraco-cms/backoffice/ufm';
import './badge.element.js';
function parseBadgeAttributes(text) {
    if (!text)
        return null;
    const pipeIndex = text.indexOf('|');
    const left = text.substring(0, pipeIndex === -1 ? undefined : pipeIndex).trim();
    const filters = pipeIndex === -1 ? null : text.substring(pipeIndex + 1).trim();
    const parts = left.split(':').map((part) => part.trim());
    const [alias, display, color, look, size, mode, separator] = parts;
    return Object.entries({ alias, filters, display, color, look, size, mode, separator })
        .map(([key, value]) => (value ? `${key}="${value}"` : null))
        .filter((item) => item)
        .join(' ');
}
export class BadgeUfmComponentApi extends UmbUfmComponentBase {
    render(token) {
        if (!token.text)
            return;
        const attributes = parseBadgeAttributes(token.text);
        return `<ufm-badge ${attributes}></ufm-badge>`;
    }
}
export { BadgeUfmComponentApi as api };
//# sourceMappingURL=badge.component.js.map