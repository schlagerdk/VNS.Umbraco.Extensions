import { UmbUfmComponentBase } from '@umbraco-cms/backoffice/ufm';
import './media.element.js';
function parseMediaAttributes(text) {
    if (!text)
        return null;
    const parts = text.split(':').map((p) => p.trim());
    const [alias, field] = parts;
    if (!alias)
        return null;
    return Object.entries({ alias, field })
        .map(([key, value]) => (value ? `${key}="${value}"` : null))
        .filter(Boolean)
        .join(' ');
}
export class MediaUfmComponentApi extends UmbUfmComponentBase {
    render(token) {
        if (!token.text)
            return;
        const attributes = parseMediaAttributes(token.text);
        if (!attributes)
            return;
        return `<ufm-media ${attributes}></ufm-media>`;
    }
}
export { MediaUfmComponentApi as api };
//# sourceMappingURL=media.component.js.map