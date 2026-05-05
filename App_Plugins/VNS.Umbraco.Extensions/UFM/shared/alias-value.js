function isBlank(value) {
    return typeof value === 'string' && value.trim().length === 0;
}
function resolvePath(source, path) {
    return path.split('.').reduce((current, segment) => {
        if (!current || typeof current !== 'object') {
            return undefined;
        }
        return current[segment];
    }, source);
}
function resolveAliasPath(model, alias) {
    const settings = model.$settings ?? {};
    if (alias.startsWith('$settings.')) {
        const settingsPath = alias.replace('$settings.', '');
        return resolvePath(settings, settingsPath);
    }
    return resolvePath(model, alias) ?? settings[alias];
}
export function getAliasValue(value, aliasExpression) {
    if (!value || typeof value !== 'object') {
        return undefined;
    }
    const [aliasPart, fallbackPart] = aliasExpression.split('??', 2);
    const alias = aliasPart?.trim();
    const fallback = fallbackPart?.trim();
    const model = value;
    const resolvedValue = alias ? resolveAliasPath(model, alias) : undefined;
    if (resolvedValue === null || resolvedValue === undefined || isBlank(resolvedValue)) {
        return fallback;
    }
    return resolvedValue;
}
//# sourceMappingURL=alias-value.js.map