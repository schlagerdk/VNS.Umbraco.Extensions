import { UMB_UFM_RENDER_CONTEXT } from '@umbraco-cms/backoffice/ufm';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbMediaDetailRepository, UmbMediaTreeRepository } from '@umbraco-cms/backoffice/media';
import { customElement, html, nothing } from '@umbraco-cms/backoffice/external/lit';

@customElement('ufm-media')
export class UfmMediaElement extends UmbLitElement {
  static override properties = {
    alias: { type: String },
    _text: { state: true }
  };

  alias?: string;
  private _text = '';

  #detailRepo?: UmbMediaDetailRepository;
  #treeRepo?: UmbMediaTreeRepository;

  constructor() {
    super();

    this.consumeContext(UMB_UFM_RENDER_CONTEXT, (context) => {
      this.observe(
        context?.value,
        async (value) => {
          const mediaKey = this.alias ? extractMediaKey(value, this.alias) : undefined;
          if (!mediaKey) {
            this._text = '';
            return;
          }

          if (!this.#detailRepo) this.#detailRepo = new UmbMediaDetailRepository(this);
          if (!this.#treeRepo) this.#treeRepo = new UmbMediaTreeRepository(this);

          const [detailResult, ancestorsResult] = await Promise.all([
            this.#detailRepo.requestByUnique(mediaKey),
            this.#treeRepo.requestTreeItemAncestors({ treeItem: { unique: mediaKey, entityType: 'media' } })
          ]);

          const currentName = detailResult.data?.variants?.[0]?.name ?? '';
          if (!currentName) {
            this._text = '';
            return;
          }

          const ancestors: string[] = (ancestorsResult.data ?? [])
            .filter((a) => typeof (a as { name?: unknown }).name === 'string')
            .map((a) => (a as { name: string }).name);

          // ancestors already includes the current item as last element
          this._text = ancestors.length > 0
            ? '/' + ancestors.join('/')
            : currentName;

          this.requestUpdate();
        },
        'observeMediaValue'
      );
    });
  }

  override render() {
    if (!this._text) {
      return nothing;
    }

    return html`<span>${this._text}</span>`;
  }
}

/**
 * Extracts a media unique key (GUID) from a property value.
 * Handles: UDI strings, plain GUIDs, single objects and arrays with mediaKey/key/unique.
 */
function extractMediaKey(value: unknown, alias: string): string | undefined {
  const raw = getAliasValue(value, alias);
  return parseMediaKey(raw);
}

function parseMediaKey(raw: unknown): string | undefined {
  if (!raw) return undefined;

  // String: either UDI "umb://media/<guid>" or plain guid
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    const udiMatch = trimmed.match(/^umb:\/\/media\/([0-9a-f-]{32,36})$/i);
    if (udiMatch) return udiMatch[1];
    if (/^[0-9a-f-]{32,36}$/i.test(trimmed)) return trimmed;
    return undefined;
  }

  // Array: use first item
  if (Array.isArray(raw)) {
    return raw.length > 0 ? parseMediaKey(raw[0]) : undefined;
  }

  // Object: look for mediaKey, key, unique
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    for (const prop of ['mediaKey', 'key', 'unique']) {
      if (typeof obj[prop] === 'string') {
        return parseMediaKey(obj[prop]);
      }
    }
  }

  return undefined;
}

function getAliasValue(value: unknown, alias: string): unknown {
  if (!value || typeof value !== 'object') return undefined;

  const model = value as Record<string, unknown>;
  const settings = (model.$settings as Record<string, unknown> | undefined) ?? {};

  if (alias.startsWith('$settings.')) {
    const path = alias.replace('$settings.', '');
    return resolvePath(settings, path);
  }

  return resolvePath(model, alias) ?? settings[alias];
}

function resolvePath(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[segment];
  }, source);
}

export { UfmMediaElement as element };

declare global {
  interface HTMLElementTagNameMap {
    'ufm-media': UfmMediaElement;
  }
}
