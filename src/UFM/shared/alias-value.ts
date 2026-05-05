function isBlank(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length === 0;
}

function resolvePath(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

function resolveAliasPath(model: Record<string, unknown>, alias: string): unknown {
  const settings = (model.$settings as Record<string, unknown> | undefined) ?? {};

  if (alias.startsWith('$settings.')) {
    const settingsPath = alias.replace('$settings.', '');
    return resolvePath(settings, settingsPath);
  }

  return resolvePath(model, alias) ?? settings[alias];
}

export function getAliasValue(value: unknown, aliasExpression: string): unknown {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const [aliasPart, fallbackPart] = aliasExpression.split('??', 2);
  const alias = aliasPart?.trim();
  const fallback = fallbackPart?.trim();

  const model = value as Record<string, unknown>;
  const resolvedValue = alias ? resolveAliasPath(model, alias) : undefined;

  if (resolvedValue === null || resolvedValue === undefined || isBlank(resolvedValue)) {
    return fallback;
  }

  return resolvedValue;
}
