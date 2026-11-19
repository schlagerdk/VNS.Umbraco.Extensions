// Re-export manifests as 'extensions' so Umbraco picks them up directly
// from the bundle JS file registered in umbraco-package.json.
// Do NOT register another bundle here - that would create a duplicate alias.
export { manifests as extensions } from './manifests.js';
//# sourceMappingURL=umbraco-package.js.map