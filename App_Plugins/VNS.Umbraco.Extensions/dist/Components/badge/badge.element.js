var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { UMB_UFM_RENDER_CONTEXT } from '@umbraco-cms/backoffice/ufm';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { customElement, html, nothing } from '@umbraco-cms/backoffice/external/lit';
let UfmBadgeElement = (() => {
    let _classDecorators = [customElement('ufm-badge')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = UmbLitElement;
    var UfmBadgeElement = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UfmBadgeElement = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static properties = {
            alias: { type: String },
            display: { type: String },
            color: { type: String },
            look: { type: String },
            _show: { state: true },
            _text: { state: true }
        };
        alias;
        display;
        color;
        look;
        _show = false;
        _text = '';
        constructor() {
            super();
            this.consumeContext(UMB_UFM_RENDER_CONTEXT, (context) => {
                this.observe(context?.value, (value) => {
                    const sourceValue = this.alias ? getAliasValue(value, this.alias) : value;
                    const isVisible = hasDisplayableValue(sourceValue);
                    const text = this.display?.trim() || toDisplayText(sourceValue);
                    this._show = isVisible && text.length > 0;
                    this._text = text;
                    this.requestUpdate();
                }, 'observeBadgeValue');
            });
        }
        render() {
            if (!this._show) {
                return nothing;
            }
            return html `<uui-tag color=${this.color ?? 'default'} look=${this.look ?? 'secondary'}>${this._text}</uui-tag>`;
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return UfmBadgeElement = _classThis;
})();
export { UfmBadgeElement };
function getAliasValue(value, alias) {
    if (!value || typeof value !== 'object') {
        return undefined;
    }
    const model = value;
    const settings = model.$settings ?? {};
    if (alias.startsWith('$settings.')) {
        const settingsPath = alias.replace('$settings.', '');
        return resolvePath(settings, settingsPath);
    }
    return resolvePath(model, alias) ?? settings[alias];
}
function resolvePath(source, path) {
    return path.split('.').reduce((current, segment) => {
        if (!current || typeof current !== 'object') {
            return undefined;
        }
        return current[segment];
    }, source);
}
function hasDisplayableValue(value) {
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
function toDisplayText(value) {
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
//# sourceMappingURL=badge.element.js.map