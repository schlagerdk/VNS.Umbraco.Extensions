# VNS Umbraco Extensions (Umbraco 17)

A backoffice extension package for Umbraco 17 that adds reusable UFM filters and components.

## Features

- `dateFormat` UFM filter
- `badge` UFM component
- `media` UFM component (renders full media path)

## Installation

1. Build the project:

```bash
npm install
npm run build
```

2. Copy `App_Plugins/VNS.Umbraco.Extensions` into your Umbraco app's `wwwroot/App_Plugins` folder.
3. Restart Umbraco (or recycle the app pool).
4. Hard refresh the browser cache.

Build output is written to `App_Plugins/VNS.Umbraco.Extensions/dist`.

## Project Structure

```text
src/
├── UFM/
│   ├── Filters/
│   │   └── DateFormat/
│   │       ├── date-format.filter.ts
│   │       └── index.ts
│   ├── Components/
│   │   ├── Badge/
│   │   │   ├── badge.component.ts
│   │   │   ├── badge.element.ts
│   │   │   └── index.ts
│   │   └── Media/
│   │       ├── media.component.ts
│   │       ├── media.element.ts
│   │       └── index.ts
│   └── index.ts
├── manifests.ts
└── umbraco-package.ts
```

## UFM Usage

### Document Type Labels

```text
{= dateAndTime | dateFormat:dd-MM-yyyy}
{= dateAndTime | dateFormat:HH:mm}
{umbValue:dateAndTime | dateFormat:monthYear}
```

### List View Columns

Use `value` in list view templates:

```text
${value | dateFormat:dd.MM.yyyy}
${value | dateFormat:HH:mm}
${value | dateFormat:dd.MM.yyyy HH:mm}
```

## `DateFormat` Filter

Supported formats:

- `short`
- `long`
- `monthYear`
- Custom tokens: `yyyy`, `yy`, `MMMM`, `MMM`, `MM`, `M`, `dd`, `d`, `HH`, `H`, `mm`, `m`, `ss`, `s`

Input types:

- ISO date string
- JavaScript `Date`
- Object with `{ date, timeZone }`

## `Badge` Component

Syntax:

```text
{badge:alias:display:color:look:size}
```

Parameters:

- `alias` (required): Property alias (or `$settings.someAlias`)
- `display` (optional): Static text shown in badge
- `color` (optional): `default`, `positive`, `warning`, `danger`, or hex (`#rgb`, `#rrggbb`, `#rrggbbaa`)
- `look` (optional): `default`, `primary`, `secondary`, `outline`, `placeholder`, or hex text color when using hex `color`
- `size` (optional): `xsmall`, `small`, `medium` (default), `large`

Examples:

```text
{badge:isFree:FREE:positive:secondary}
{badge:stage}
{badge:isSoldOut:SOLD OUT:danger:default}
{badge:isFree:FREE:#27ae60:#ffffff}
{badge:stage:::#1a1a2e:#e94560:xsmall}
```

Note: UFM filters such as `stripHtml`/`truncate` are not piped onto component output. If needed, add component-specific options.

## `Media` Component

Syntax:

```text
{media:alias}
```

Behavior:

- Resolves media picker value from the given alias
- Supports UDI string, GUID string, object (`mediaKey`/`key`/`unique`) and arrays
- Renders the full media path, for example:
  - `/Media/Galleries/Gallery 2`
  - `/Top Images/Hero.jpg`

## Troubleshooting

Quick checks:

1. Confirm `App_Plugins/VNS.Umbraco.Extensions/dist/umbraco-package.js` is deployed.
2. Check browser console for JS errors.
3. Verify `umbraco-package.js` is loaded in the network tab.
4. Restart Umbraco and hard refresh.

## Versioning Strategy

This repository uses Semantic Versioning:

- Major: breaking changes
- Minor: backward-compatible features
- Patch: backward-compatible fixes

### Version Commands

```bash
npm run version:patch
npm run version:minor
npm run version:major
```

These commands:

1. Update `package.json`
2. Sync the same version to `App_Plugins/VNS.Umbraco.Extensions/umbraco-package.json`

## Release Flow

1. Choose version bump (`patch`/`minor`/`major`):

```bash
npm run version:patch
```

2. Build and verify:

```bash
npm run release:check
```

3. Commit and tag:

```bash
git add .
git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
```

4. Push code and tag:

```bash
git push origin main
git push origin vX.Y.Z
```

5. Create a GitHub release from tag `vX.Y.Z`.
