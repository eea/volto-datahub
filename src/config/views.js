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
          id: 'rod',
          title: 'Reporting obligations',
          facetField: 'rod',
          sortOn: 'alpha',
        },
        {
          id: 'topics',
          title: 'EEA topics',
          facetField: 'topic',
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
