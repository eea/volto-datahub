import {
  multiTermFacet,
  fixedRangeFacet,
  histogramFacet,
  makeRange,
  booleanFacet,
  dateRangeFacet,
} from '@eeacms/search';

export function getTodayWithTime() {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  const output = [
    d.getFullYear(),
    '-',
    month < 10 ? '0' : '',
    month,
    '-',
    day < 10 ? '0' : '',
    day,
    'T',
    hour < 10 ? '0' : '',
    hour,
    ':',
    minute < 10 ? '0' : '',
    minute,
    ':',
    second < 10 ? '0' : '',
    second,
    'Z',
  ].join('');
  return output;
}

const facets = [
  booleanFacet(() => ({
    field: 'IncludeArchived',
    label: 'Include archived content',
    id: 'archived-facet',
    showInFacetsList: false,
    showInSecondaryFacetsList: true,
    isFilter: true, // filters don't need facet options to show up

    // we want this to be applied by default
    // when the facet is checked, then apply the `on` key:
    off: {
      constant_score: {
        filter: {
          bool: {
            should: [
              { bool: { must_not: { exists: { field: 'expires' } } } },
              // Functions should be supported in the buildFilters
              { range: { expires: { gte: getTodayWithTime() } } },
            ],
          },
        },
      },
    },
    on: null,
  })),

  multiTermFacet({
    field: 'instrument',
    isFilterable: true,
    isMulti: true,
    label: 'Legislation',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'rod',
    isFilterable: true,
    isMulti: true,
    label: 'Reporting obligations',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
  }),
  multiTermFacet({
    field: 'topic',
    isFilterable: true,
    isMulti: true,
    label: 'EEA topics',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'dataset_formats',
    isFilterable: true,
    isMulti: true,
    label: 'Available formats',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'gemet',
    isFilterable: true,
    isMulti: true,
    label: 'GEMET keywords',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
  }),
  multiTermFacet({
    field: 'organisation',
    isFilterable: true,
    isMulti: true,
    label: 'Organisations',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
  }),
  multiTermFacet({
    field: 'spatialRepresentationType',
    isFilterable: true,
    isMulti: true,
    label: 'Spatial Representation Type',
    show: 10000,
    showAllOptions: true, // show all options (even if 0) in modal facet
  }),
  fixedRangeFacet({
    // wrapper: 'ModalFacetWrapper',
    field: 'resolutionScaleDenominator',
    label: 'Scales',
    rangeType: 'fixed',
    isMulti: true,
    ranges: [
      { from: 0, to: 99999, key: '*-100,000' },
      { from: 100000, to: 999999, key: '100,000-1,000,000' },
      { from: 1000000, to: 9999999, key: '1,000,000-10,000,000' },
      { from: 10000000, to: 99999999999, key: '10,000,000-*' },
      //        { to: -0.0001, key: 'Unknown' },
    ],
    factory: 'FixedRangeFacet',
  }),
  multiTermFacet({
    field: 'op_cluster',
    isFilterable: true,
    isMulti: true,
    label: 'Section',
    show: 10000,
    showInFacetsList: false,
  }),
  dateRangeFacet({
    field: 'issued.date',
    label: ' ',
    isFilter: true, // filters don't need facet options to show up
    showInFacetsList: false,
    showInSecondaryFacetsList: true,
    // rangeType: 'dateRange',
    isMulti: false,
    ranges: [
      { key: 'All time' },
      { key: 'Last week', from: 'now-1w', to: 'now' },
      { key: 'Last month', from: 'now-1m', to: 'now' },
      { key: 'Last 3 months', from: 'now-3m', to: 'now' },
      { key: 'Last year', from: 'now-1y', to: 'now' },
      { key: 'Last 2 years', from: 'now-2y', to: 'now' },
    ],
    factory: 'DropdownRangeFilter',
    default: {
      values: ['All time'],
      type: 'any',
    },
  }),
  multiTermFacet({
    field: 'cluster_name',
    isFilterable: false,
    isMulti: true,
    showInFacetsList: false,
    label: 'Sources',
    iconsFamily: 'Sources',
  }),
  histogramFacet({
    field: 'time_coverage',
    isMulti: true,
    label: 'Time coverage',
    // TODO: implement split in buckets
    ranges: makeRange({
      step: 1,
      normalRange: [1985, 2025],
      includeOutlierStart: false,
      includeOutlierEnd: false,
    }),
    step: 10,
    // isFilterable: false,
    aggs_script:
      "def vals = doc['time_coverage']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
  }),
];

const facetsWrapper = {
  facets,
};

export default facetsWrapper;

// wrapper: 'ModalFacetWrapper',
// factory: 'MultiTermListFacet',
// histogramFacet({
//   wrapper: 'ModalFacetWrapper',
//   field: 'year',
//   // isFilterable: false,
//   isMulti: true,
//   label: 'Publishing year',
//   // TODO: implement split in buckets
//   ranges: makeRange({
//     step: 1,
//     normalRange: [1994, 2022],
//     includeOutlierStart: false,
//     includeOutlierEnd: false,
//   }),
//   step: 10,
//   // [
//   //   {
//   //     to: 1900,
//   //   },
//   //   {
//   //     key: '2001-2010',
//   //     from: 2001,
//   //     to: 2010,
//   //   },
//   //   {
//   //     from: 2011,
//   //   },
//   // ]
//   // min_max_script:
//   //
//   //"def vals = doc['year']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}",

//   aggs_script:
//     "def vals = doc['year']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
// }),

// histogramFacet({
//   wrapper: 'ModalFacetWrapper',
//   field: 'time_coverage',
//   // isFilterable: false,
//   isMulti: true,
//   label: 'Time coverage',
//   // TODO: implement split in buckets
//   ranges: makeRange({
//     step: 10,
//     normalRange: [1700, 2210],
//     includeOutlierStart: false,
//     includeOutlierEnd: false,
//   }),
//   step: 10,
//   // [
//   //   {
//   //     to: 1900,
//   //   },
//   //   {
//   //     key: '2001-2010',
//   //     from: 2001,
//   //     to: 2010,
//   //   },
//   //   {
//   //     from: 2011,
//   //   },
//   // ]
//   // min_max_script:
//   //
//   //"def vals = doc['year']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}",

//   aggs_script:
//     "def vals = doc['time_coverage']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
// }),

// fixedRangeFacet({
//   wrapper: 'ModalFacetWrapper',
//   field: 'readingTime',
//   label: 'Reading time (minutes)',
//   rangeType: 'fixed',
//   isMulti: true,
//   ranges: [
//     { key: 'All' },
//     { from: 0, to: 4.99999, key: 'Short (<5 minutes)' },
//     { from: 5, to: 24.9999, key: 'Medium (5-25 minutes)' },
//     { from: 25, to: 10000, key: 'Large (25+ minutes)' },
//     //        { to: -0.0001, key: 'Unknown' },
//   ],
//   factory: 'ModalFixedRangeFacet',
//   default: {
//     values: [{ name: 'All', rangeType: 'fixed' }],
//     type: 'any',
//   },
// }),
////////////////////
// booleanFacet(() => ({
//   field: 'IncludeArchived',
//   label: 'Include archived content',
//   id: 'archived-facet',
//   showInFacetsList: false,
//   showInSecondaryFacetsList: true,
//   isFilter: true, // filters don't need facet options to show up

//   // we want this to be applied by default
//   // when the facet is checked, then apply the `on` key:
//   off: {
//     constant_score: {
//       filter: {
//         bool: {
//           should: [
//             { bool: { must_not: { exists: { field: 'expires' } } } },
//             // Functions should be supported in the buildFilters
//             { range: { expires: { gte: getTodayWithTime() } } },
//           ],
//         },
//       },
//     },
//   },
//   on: null,
// })),
// multiTermFacet({
//   field: 'moreLikeThis',
//   isFilterable: true,
//   isMulti: false,
//   label: 'More like this',
//   showInFacetsList: false,
//   filterListComponent: 'MoreLikeThisEntry',
//   factory: 'MoreLikeThis',
//   condition: 'like',
//   queryParams: {
//     fields: ['title', 'text'],
//     min_term_freq: 1,
//     max_query_terms: 12,
//   },

//   // registryConfig: 'MoreLikeThis',
// }),
// multiTermFacet({
//   field: 'topic',
//   isFilterable: true,
//   isMulti: true,
//   label: 'Topics',
//   //blacklist: topicsBlacklist,
//   factory: 'MultiTermListFacet',
//   wrapper: 'ModalFacetWrapper',
//   show: 10000,
//   showAllOptions: true, // show all options (even if 0) in modal facet
//   // factory: 'sui.Facet',
// }),
// multiTermFacet({
//   field: 'spatial',
//   isFilterable: true,
//   isMulti: true,
//   label: 'Countries',
//   //whitelist: spatialWhitelist,
//   wrapper: 'ModalFacetWrapper',
//   show: 10000,
//   factory: 'MultiTermListFacet',
//   iconsFamily: 'Countries',
//   enableExact: true,
//   sortOn: 'value',
// }),
// factory: 'MultiTermListFacet',
// wrapper: 'ModalFacetWrapper',
// factory: 'sui.Facet',
// factory: 'MultiTermListFacet',
// wrapper: 'ModalFacetWrapper',
// factory: 'sui.Facet',
// factory: 'MultiTermListFacet',
// wrapper: 'ModalFacetWrapper',
// factory: 'sui.Facet',
// factory: 'MultiTermListFacet',
// wrapper: 'ModalFacetWrapper',
// factory: 'sui.Facet',
// factory: 'ModalFixedRangeFacet',
// default: {
//   values: [{ name: 'All', rangeType: 'fixed' }],
//   type: 'any',
// },
// wrapper: 'ModalFacetWrapper',
// factory: 'MultiTermListFacet',
