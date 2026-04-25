import { UMB_UFM_RENDER_CONTEXT } from '@umbraco-cms/backoffice/ufm';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { customElement, html, nothing } from '@umbraco-cms/backoffice/external/lit';

type UuiTagColor = 'default' | 'positive' | 'warning' | 'danger';
type UuiTagLook = 'default' | 'primary' | 'secondary' | 'outline' | 'placeholder';
type BadgeSize = 'xsmall' | 'small' | 'medium' | 'large';
const BADGE_BASELINE_OFFSET_STYLE = 'position:relative;top:-1px;';

function isHex(value: string | undefined): value is string {
  return !!value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());
}

const SIZE_STYLES: Record<BadgeSize, string> = {
  xsmall: '--uui-tag-font-size: 9px; --uui-tag-padding: 0 3px; --uui-tag-border-radius: 2px;',
  small: '--uui-tag-font-size: 10px; --uui-tag-padding: 0 5px;',
  medium: '',
  large: '--uui-tag-font-size: 16px; --uui-tag-padding: 4px 12px;'
};

@customElement('ufm-badge')
export class UfmBadgeElement extends UmbLitElement {
  static override properties = {
    alias: { type: String },
    display: { type: String },
    color: { type: String },
    look: { type: String },
    size: { type: String },
    _show: { state: true },
    _text: { state: true }
  };

  alias?: string;
  display?: string;
  color?: UuiTagColor;
  look?: UuiTagLook;
  size?: BadgeSize;
  private _show = false;
  private _text = '';

  constructor() {
    super();

    this.consumeContext(UMB_UFM_RENDER_CONTEXT, (context) => {
      this.observe(
        context?.value,
        (value) => {
          const sourceValue = this.alias ? getAliasValue(value, this.alias) : value;
          const isVisible = hasDisplayableValue(sourceValue);
          const text = this.display?.trim() || toDisplayText(sourceValue);

          this._show = isVisible && text.length > 0;
          this._text = text;
          this.requestUpdate();
        },
        'observeBadgeValue'
      );
    });
  }

  override render() {
    if (!this._show) {
      return nothing;
    }

    const sizeStyle = this.size ? (SIZE_STYLES[this.size] ?? '') : '';
    const badgeStyle = `${BADGE_BASELINE_OFFSET_STYLE}${sizeStyle}`;

    if (isHex(this.color)) {
      const bgColor = this.color;
      const textColor = isHex(this.look) ? this.look : '#ffffff';
      const hexStyle = [
        `background:${bgColor}`,
        `color:${textColor}`,
        'display:inline-flex',
        'align-items:center',
        'border-radius:3px',
        'padding:0 6px',
        'font-size:12px',
        'font-weight:500',
        'line-height:1.6',
        badgeStyle
      ]
        .filter(Boolean)
        .join(';');
      return html`<span style=${hexStyle}>${this._text}</span>`;
    }

    return html`<uui-tag color=${this.color ?? 'default'} look=${this.look ?? 'secondary'} style=${badgeStyle}>${this._text}</uui-tag>`;
  }
}

function getAliasValue(value: unknown, alias: string): unknown {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const model = value as Record<string, unknown>;
  const settings = (model.$settings as Record<string, unknown> | undefined) ?? {};

  if (alias.startsWith('$settings.')) {
    const settingsPath = alias.replace('$settings.', '');
    return resolvePath(settings, settingsPath);
  }

  return resolvePath(model, alias) ?? settings[alias];
}

function resolvePath(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

function hasDisplayableValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized.length > 0 && normalized !== '0' && normalized !== 'false' && normalized !== 'null';
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

function toDisplayText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

export { UfmBadgeElement as element };

declare global {
  interface HTMLElementTagNameMap {
    'ufm-badge': UfmBadgeElement;
  }
}
