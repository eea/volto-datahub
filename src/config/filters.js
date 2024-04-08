/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  // filter values that are always added to the ES requests
  permanentFilters: [{ term: { cluster_name: 'sdi' } }],
};
