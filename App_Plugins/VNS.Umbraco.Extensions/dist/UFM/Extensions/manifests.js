export const manifests = [
    {
        type: 'ufmFilter',
        alias: 'VNS.Umbraco.Extensions.UfmFilter.DateFormat',
        name: 'Date Format UFM Filter',
        api: () => import('./filters/date-format.filter.js'),
        meta: {
            alias: 'dateFormat'
        }
    },
    {
        type: 'ufmComponent',
        alias: 'VNS.Umbraco.Extensions.UfmComponent.Badge',
        name: 'Badge UFM Component',
        api: () => import('./components/badge/badge.component.js'),
        meta: {
            alias: 'badge'
        }
    }
];
//# sourceMappingURL=manifests.js.map