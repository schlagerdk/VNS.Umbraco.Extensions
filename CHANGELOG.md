# Changelog

The versions follow Umbraco's: 18.3.2 is for Umbraco 18.3.2 and newer, and a fourth number (18.3.2.1) is a fix of
the package for the same Umbraco. The NuGet package, the Umbraco package manifest and the git tag share the version.

## Unreleased

- Build: tsc compiles straight into `nuget/wwwroot/App_Plugins/VNS.Umbraco.Extensions`, without `dist/`. The
  package's `.js` files are the same; the source maps point to `src/` from where they are.

## 18.3.2

- For Umbraco 18.3.2 and newer: the package allows Umbraco `[18.3.2, 19.0.0)`. No code changes since 18.3.0.1.

## 18.3.0.1

- Docs: `/App_Plugins/VNS.Umbraco.Extensions` is the URL the files are served at, not a folder in the site. On disk
  they are in the NuGet package cache when the site runs from its project, and in
  `<publish folder>/wwwroot/App_Plugins/VNS.Umbraco.Extensions` after `dotnet publish`.

## 18.3.0

- For Umbraco 18.3.0 and newer: the package allows Umbraco `[18.3.0, 19.0.0)`.
- The Umbraco package manifest is named `VNS.Umbraco.Extensions`, as the package.

## 18.0.0.1

- Fix: the package has no assembly any more. 18.0.0 had an empty `VNS.Umbraco.Extensions.dll`, and when the package
  was removed and the site published into a folder that was not cleaned, the dll was left there and Umbraco did not
  start (`FileNotFoundException: VNS.Umbraco.Extensions`).
- Docs: `dotnet publish` copies the files into the publish folder, as with all static web assets.

## 18.0.0

- For Umbraco 18: the package allows Umbraco `[18.0.0, 19.0.0)` and is built against `@umbraco-cms/backoffice` 18.
  No code changes. Umbraco 17 is no longer supported; 17.0.0 stays on NuGet as it is.

## 17.0.0

- Shipped as the NuGet package `VNS.Umbraco.Extensions` (a Razor Class Library with static web assets): the files are
  served from `/App_Plugins/VNS.Umbraco.Extensions` out of the package, not copied into the site's project. Sites that
  had the folder copied in by hand must delete it before installing.
- Versions follow Umbraco's, from one version in `package.json` (`npm run version:set`); `dotnet pack` fails when the
  versions differ, and `npm run release:tag` tags the release.
- `badge` and `media`: the alias supports a fallback with `??`, for example `stage??ALL`, used when the value is
  `null`, `undefined` or blank.

## 1.0.3

- New `tagsFormat` filter: JSON or CSV tags as separated text, with output and input separators as arguments.
- `badge`: `mode:tags` renders one badge per tag, with an input separator for CSV.
- `dateFormat`: accepts localized dates such as `5.5.2026, 10.25.15`.

## 1.0.2

- Build layout cleaned up: the bundle is at the package root instead of under `dist/`.

## 1.0.1

- `dateFormat`: formats `monthName`, `weekdayName` and `weekNumber`/`week`, tokens `dddd`, `ddd`, `ww`, `w`, and
  month and weekday names in title case.
- `badge`: aligned to the text's baseline.

## 1.0.0

- First release: the `dateFormat` filter and the `badge` and `media` components. Copied into a site's `App_Plugins`
  by hand; not on NuGet.
