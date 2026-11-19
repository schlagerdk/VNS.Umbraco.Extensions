# VNS Umbraco Extensions

UFM filters and components for the Umbraco 18 backoffice. Its versions follow Umbraco's: VNS.Umbraco.Extensions 18.3.0 is for Umbraco 18.3.0 and newer, and a fourth number (18.3.0.1) is a fix of the package for the same Umbraco.

- `dateFormat` filter: dates as `dd-MM-yyyy`, `HH:mm`, `monthYear`, `weekNumber` and more
- `tagsFormat` filter: tags as readable text, stored as JSON or CSV
- `badge` component: a property's value as a badge, or one badge per tag
- `media` component: a media picker's value as the full media path

## Installation

Use the package manager [nuget](https://nuget.org) to install.

```bash
dotnet add package VNS.Umbraco.Extensions
```

Restart the site and hard refresh the backoffice. Nothing else needs to be set up.

The browser gets the package's files at the URL `/App_Plugins/VNS.Umbraco.Extensions/...`. On disk, they are not copied into the site's project: in development they are served from the NuGet package cache. `dotnet publish` copies them into the publish folder, at `<publish folder>/wwwroot/App_Plugins/VNS.Umbraco.Extensions/`, as with all static web assets. When the package is removed, a publish into a folder that is not cleaned leaves them there: delete `wwwroot/App_Plugins/VNS.Umbraco.Extensions` (and `VNS.Umbraco.Extensions.dll` from 18.0.0) from the publish folder. The package has no assembly, so nothing else is left. A site that had the files copied into `wwwroot/App_Plugins/VNS.Umbraco.Extensions` by hand must delete that folder before installing the package.

## Usage

In document type labels, block labels and list view columns (use `value` in list views):

```text
{umbValue:dateAndTime | dateFormat:dd-MM-yyyy}
{umbValue:dateAndTime | dateFormat:monthYear}
{umbValue:tags | tagsFormat: · }
{badge:isFree:FREE:positive:secondary}
{badge:stage??ALL:::outline:medium:}
{badge:myTags:::secondary:small:tags}
{media:heroImage??fallbackImage}
```

All the options are described at [github.com/schlagerdk/VNS.Umbraco.Extensions](https://github.com/schlagerdk/VNS.Umbraco.Extensions).

## Requirements

- Umbraco 18, .NET 10

## License

MIT, see `LICENSE.md`.
