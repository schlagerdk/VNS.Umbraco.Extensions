# VNS Umbraco Extensions

UFM filters and components for the Umbraco 17 backoffice. Its versions follow Umbraco's: VNS.Umbraco.Extensions 17.0.0 is for Umbraco 17.0.0 and newer, and a fourth number (17.0.0.1) is a fix of the package for the same Umbraco.

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

The package's files are served from `/App_Plugins/VNS.Umbraco.Extensions` but are never copied into the site, so removing the package removes them too. A site that had the files copied into `wwwroot/App_Plugins/VNS.Umbraco.Extensions` by hand must delete that folder before installing the package.

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

- Umbraco 17, .NET 10

## License

MIT, see `LICENSE.md`.
