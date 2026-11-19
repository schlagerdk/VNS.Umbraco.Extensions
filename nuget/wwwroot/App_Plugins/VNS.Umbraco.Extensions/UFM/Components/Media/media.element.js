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
import { UmbMediaDetailRepository, UmbMediaTreeRepository } from '@umbraco-cms/backoffice/media';
import { customElement, html, nothing } from '@umbraco-cms/backoffice/external/lit';
import { getAliasValue } from '../../shared/alias-value.js';
let UfmMediaElement = (() => {
    let _classDecorators = [customElement('ufm-media')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = UmbLitElement;
    var UfmMediaElement = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UfmMediaElement = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static properties = {
            alias: { type: String },
            _text: { state: true }
        };
        alias;
        _text = '';
        #detailRepo;
        #treeRepo;
        constructor() {
            super();
            this.consumeContext(UMB_UFM_RENDER_CONTEXT, (context) => {
                this.observe(context?.value, async (value) => {
                    const mediaKey = this.alias ? extractMediaKey(value, this.alias) : undefined;
                    if (!mediaKey) {
                        this._text = '';
                        return;
                    }
                    if (!this.#detailRepo)
                        this.#detailRepo = new UmbMediaDetailRepository(this);
                    if (!this.#treeRepo)
                        this.#treeRepo = new UmbMediaTreeRepository(this);
                    const [detailResult, ancestorsResult] = await Promise.all([
                        this.#detailRepo.requestByUnique(mediaKey),
                        this.#treeRepo.requestTreeItemAncestors({ treeItem: { unique: mediaKey, entityType: 'media' } })
                    ]);
                    const currentName = detailResult.data?.variants?.[0]?.name ?? '';
                    if (!currentName) {
                        this._text = '';
                        return;
                    }
                    const ancestors = (ancestorsResult.data ?? [])
                        .filter((a) => typeof a.name === 'string')
                        .map((a) => a.name);
                    // ancestors already includes the current item as last element
                    this._text = ancestors.length > 0
                        ? '/' + ancestors.join('/')
                        : currentName;
                    this.requestUpdate();
                }, 'observeMediaValue');
            });
        }
        render() {
            if (!this._text) {
                return nothing;
            }
            return html `<span>${this._text}</span>`;
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return UfmMediaElement = _classThis;
})();
export { UfmMediaElement };
/**
 * Extracts a media unique key (GUID) from a property value.
 * Handles: UDI strings, plain GUIDs, single objects and arrays with mediaKey/key/unique.
 */
function extractMediaKey(value, alias) {
    const raw = getAliasValue(value, alias);
    return parseMediaKey(raw);
}
function parseMediaKey(raw) {
    if (!raw)
        return undefined;
    // String: either UDI "umb://media/<guid>" or plain guid
    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        const udiMatch = trimmed.match(/^umb:\/\/media\/([0-9a-f-]{32,36})$/i);
        if (udiMatch)
            return udiMatch[1];
        if (/^[0-9a-f-]{32,36}$/i.test(trimmed))
            return trimmed;
        return undefined;
    }
    // Array: use first item
    if (Array.isArray(raw)) {
        return raw.length > 0 ? parseMediaKey(raw[0]) : undefined;
    }
    // Object: look for mediaKey, key, unique
    if (typeof raw === 'object' && raw !== null) {
        const obj = raw;
        for (const prop of ['mediaKey', 'key', 'unique']) {
            if (typeof obj[prop] === 'string') {
                return parseMediaKey(obj[prop]);
            }
        }
    }
    return undefined;
}
export { UfmMediaElement as element };
//# sourceMappingURL=media.element.js.map