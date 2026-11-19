# VNS Umbraco Extensions (Umbraco 18)

A backoffice extension package for Umbraco 18 that adds reusable UFM filters and components.

## Features

- `dateFormat` UFM filter
- `tagsFormat` UFM filter (handles both JSON and CSV tag storage)
- `badge` UFM component
- `media` UFM component (renders full media path)

## Installation

Install the NuGet package in the Umbraco site:

```bash
dotnet add package VNS.Umbraco.Extensions
```

Restart Umbraco and hard refresh the backoffice.

The package is a Razor Class Library with static web assets and no assembly. The browser always gets the files at the URL `/App_Plugins/VNS.Umbraco.Extensions/...` (`wwwroot` is the site's web root, so it is not part of the URL). Where they are on disk depends on how the site runs:

- **From the project** (`dotnet run`, development): nothing is copied into the project's `wwwroot`. The files are served straight from the NuGet package cache (`~/.nuget/packages/vns.umbraco.extensions/<version>/staticwebassets/`). Removing the package (`dotnet remove package VNS.Umbraco.Extensions` and a clean build) removes them.
- **After `dotnet publish`** (a server): the files are copied into the publish folder, at `<publish folder>/wwwroot/App_Plugins/VNS.Umbraco.Extensions/`, as with all static web assets. A publish into an empty folder has them only while the package is installed. A publish into a folder that already has an older publish and is not cleaned leaves them there after the package is removed, and Umbraco still loads `umbraco-package.json` from there: delete the folder by hand, or publish into an empty folder.
- **No assembly**: from 18.0.0.1 the package has no `VNS.Umbraco.Extensions.dll`. 18.0.0 had one, and when it was left in a publish folder after the package was removed, Umbraco did not start (`FileNotFoundException: Could not load file or assembly 'VNS.Umbraco.Extensions'`). Delete `VNS.Umbraco.Extensions.dll` from the publish folder if it is there.

### Moving from a copied App_Plugins folder

Sites that had `App_Plugins/VNS.Umbraco.Extensions` copied into `wwwroot` by hand must delete that folder before installing the package. Otherwise the build fails because the same file exists both in the site and in the package. The error is `Microsoft.NET.Sdk.StaticWebAssets.targets: error : InvalidOperationException: Sequence contains more than one element`.

## Development

```bash
npm install
npm run build   # src/ -> dist/ -> nuget/wwwroot/App_Plugins/VNS.Umbraco.Extensions/
npm run pack    # build + dotnet pack -> nuget/artifacts/VNS.Umbraco.Extensions.<version>.nupkg
```

To try a local package in a site, add `nuget/artifacts` as a package source in the site's `nuget.config`.

## Project Structure

```text
src/                               TypeScript source
├── UFM/
│   ├── Filters/
│   │   ├── DateFormat/
│   │   └── TagsFormat/
│   ├── Components/
│   │   ├── Badge/
│   │   └── Media/
│   ├── shared/
│   └── index.ts
├── manifests.ts
└── umbraco-package.ts
nuget/                             The NuGet package VNS.Umbraco.Extensions
├── VNS.Umbraco.Extensions.csproj
├── VNS.Umbraco.Extensions.sln
├── docs/                          README.md, LICENSE.md and icon.png packed in the .nupkg
└── wwwroot/App_Plugins/VNS.Umbraco.Extensions/
    ├── umbraco-package.json       Umbraco package manifest (kept in git, not built)
    └── ...                        Build output from src/
scripts/sync-version.mjs
```

## UFM Usage

### Document Type Labels

```text
{= dateAndTime | dateFormat:dd-MM-yyyy}
{= dateAndTime | dateFormat:HH:mm}
{umbValue:dateAndTime | dateFormat:monthYear}
{umbValue:dateAndTime | dateFormat:monthName}
{umbValue:dateAndTime | dateFormat:weekdayName}
{umbValue:dateAndTime | dateFormat:weekNumber}
{umbValue:tags | tagsFormat}
{umbValue:tags | tagsFormat: · }
```

### List View Columns

Use `value` in list view templates:

```text
{umbValue:value | dateFormat:dd.MM.yyyy}
{umbValue:value | dateFormat:HH:mm}
{umbValue:value | dateFormat:dd.MM.yyyy HH:mm}
{umbValue:value | tagsFormat}
```

## `DateFormat` Filter

Supported formats:

- `short`
- `long`
- `monthYear`
- `monthName` (title case)
- `weekdayName` (title case)
- `weekNumber` / `week` (ISO week, padded to 2 digits)
- Custom tokens: `yyyy`, `yy`, `MMMM`, `MMM`, `dddd`, `ddd`, `ww`, `w`, `MM`, `M`, `dd`, `d`, `HH`, `H`, `mm`, `m`, `ss`, `s`

Note: month and weekday names are returned in title case (including `monthYear`, for example `April 2026` and `Mandag`).

Input types:

- ISO date string
- Localized system date string (for example `5.5.2026, 10.25.15`)
- JavaScript `Date`
- Object with `{ date, timeZone }`

## `TagsFormat` Filter

Use to normalize tags output to readable separated text.

Syntax:

```text
{umbValue:value | tagsFormat}
{umbValue:value | tagsFormat: · }
{umbValue:value | tagsFormat:, :;}
```

Arguments:

- First arg: output separator (default `, `)
- Second arg: input separator when source is CSV (default `,`)

Examples:

- JSON `["news","featured"]` -> `news, featured`
- CSV `news,featured` -> `news, featured`

## `Badge` Component

Syntax:

```text
{badge:alias:display:color:look:size:mode:separator}
```

Parameters:

- `alias` (required): Property alias (or `$settings.someAlias`). Supports fallback with `??`, for example `stage??ALL`. Fallback is used when the resolved value is `null`, `undefined`, or blank text.
- `display` (optional): Static text shown in badge
- `color` (optional): `default`, `positive`, `warning`, `danger`, or hex (`#rgb`, `#rrggbb`, `#rrggbbaa`)
- `look` (optional): `default`, `primary`, `secondary`, `outline`, `placeholder`, or hex text color when using hex `color`
- `size` (optional): `xsmall`, `small`, `medium` (default), `large`
- `mode` (optional): `single` (default) or `tags`
- `separator` (optional): input separator for `mode:tags` (default `,`)

Examples:

```text
{badge:isFree:FREE:positive:secondary}
{badge:stage}
{badge:stage??ALL:::outline:medium:}
{badge:isSoldOut:SOLD OUT:danger:default}
{badge:isFree:FREE:#27ae60:#ffffff}
{badge:stage:::#1a1a2e:#e94560:xsmall}
{badge:myTags:::secondary:small:tags}
```

When `mode` is `tags`, the component renders one badge per tag entry and supports:

- JSON arrays (default Umbraco tags cache format)
- CSV strings (`tag1,tag2,tag3`)

Note: UFM filters such as `stripHtml`/`truncate` are not piped onto component output. If needed, add component-specific options.

## `Media` Component

Syntax:

```text
{media:alias}
```

`alias` also supports fallback with `??`, for example `{media:heroImage??fallbackImage}`. Fallback is used when the resolved value is `null`, `undefined`, or blank text.

Behavior:

- Resolves media picker value from the given alias
- Supports UDI string, GUID string, object (`mediaKey`/`key`/`unique`) and arrays
- Renders the full media path, for example:
  - `/Media/Galleries/Gallery 2`
  - `/Top Images/Hero.jpg`

## Troubleshooting

Quick checks:

1. Confirm `/App_Plugins/VNS.Umbraco.Extensions/umbraco-package.json` opens in the browser on the site.
2. Check browser console for JS errors.
3. Verify `umbraco-package.js` is loaded in the network tab.
4. Restart Umbraco and hard refresh.

## Versioning Strategy

The versions follow Umbraco's, as in VNS.Harbor: `18.3.0` is for Umbraco 18.3.0 and newer. A fourth number (`18.3.0.1`) is a fix of the package for the same Umbraco. The NuGet package allows Umbraco `[18.3.0, 19.0.0)`.

There is one version: the one in `package.json`. The NuGet package, the Umbraco package manifest (shown under Packages in the backoffice) and the git tag always have the same one.

```bash
npm run version:set 18.0.1   # sets the version and writes it everywhere
npm run version:sync         # writes the version in package.json everywhere (every build does this)
```

It is written to:

1. `nuget/VNS.Umbraco.Extensions.csproj` (`<Version>`)
2. `nuget/wwwroot/App_Plugins/VNS.Umbraco.Extensions/umbraco-package.json` (`version`, and `?v=<version>` on the bundle so browsers fetch the new code)

`dotnet pack` refuses to make a package when the three differ, also when it is run without npm. `npm run release:tag` tags the commit `v<version>`.

## Release Flow

1. Set the version:

```bash
npm run version:set 18.0.1
```

2. Build and pack:

```bash
npm run release:check
```

3. Commit, tag and push:

```bash
git add .
git commit -m "release: v18.0.1"
npm run release:tag          # tags v18.0.1; refuses if anything is uncommitted, the versions differ or the tag exists
git push origin main v18.0.1
```

4. Create a GitHub release from the tag, and push the package to nuget.org:

```bash
dotnet nuget push nuget/artifacts/VNS.Umbraco.Extensions.18.0.1.nupkg --source https://api.nuget.org/v3/index.json --api-key <key>
```
