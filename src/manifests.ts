import type { ManifestUfmComponent, ManifestUfmFilter } from '@umbraco-cms/backoffice/ufm';

export const manifests: Array<ManifestUfmFilter | ManifestUfmComponent> = [
  {
    type: 'ufmFilter',
    alias: 'VNS.Umbraco.Extensions.UfmFilter.DateFormat',
    name: 'Date Format UFM Filter',
    api: () => import('./UFM/Filters/DateFormat/index.js'),
    meta: {
      alias: 'dateFormat'
    }
  },
  {
    type: 'ufmFilter',
    alias: 'VNS.Umbraco.Extensions.UfmFilter.TagsFormat',
    name: 'Tags Format UFM Filter',
    api: () => import('./UFM/Filters/TagsFormat/index.js'),
    meta: {
      alias: 'tagsFormat'
    }
  },
  {
    type: 'ufmComponent',
    alias: 'VNS.Umbraco.Extensions.UfmComponent.Badge',
    name: 'Badge UFM Component',
    api: () => import('./UFM/Components/Badge/index.js'),
    meta: {
      alias: 'badge'
    }
  },
  {
    type: 'ufmComponent',
    alias: 'VNS.Umbraco.Extensions.UfmComponent.Media',
    name: 'Media UFM Component',
    api: () => import('./UFM/Components/Media/index.js'),
    meta: {
      alias: 'media'
    }
  }
];
