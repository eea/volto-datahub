/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  resultViews: [
    {
      id: 'datahubCards',
      title: 'Horizontal cards',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'DatahubCardItem',
      },
    },
  ],
  initialView: {
    factory: 'DatahubLandingPage',
    tilesLandingPageParams: {
      maxPerSection: 30,
      sortField: 'issued.date',
      sortDirection: 'desc',
      sections: [
        {
          id: 'topics',
          title: 'EEA topics',
          facetField: 'topic',
          sortOn: 'alpha',
        },
        {
          id: 'instrument',
          title: 'Legislation',
          facetField: 'instrument',
          sortOn: 'alpha',
        },
        {
          id: 'formats',
          title: 'Formats',
          facetField: 'dataset_formats',
          sortOn: 'alpha',
        },
        {
          id: 'website',
          title: 'Sources',
          facetField: 'cluster_name',
          sortOn: 'count',
          sortOrder: 'desc',
          hidden: true,
        },
      ],
    },
  },
};
