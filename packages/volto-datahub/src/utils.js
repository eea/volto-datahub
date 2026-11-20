const OBSOLETE_KEYS = ['obsolete', 'superseded'];

export const isInternalURL = (url) => {
  let internal = false;
  url.split('/').forEach((part) => {
    if (part.split('_')[6] === 'i') {
      internal = true;
    }
  });
  return internal;
};

export const isObsolete = (status) => {
  let obsolete = false;
  if (status) {
    if (Array.isArray(status)) {
      if (
        status.filter((stat) => OBSOLETE_KEYS.includes(stat?.key)).length > 0
      ) {
        obsolete = true;
      }
    } else {
      if (OBSOLETE_KEYS.includes(status?.key)) {
        obsolete = true;
      }
    }
  }
  return obsolete;
};

export const isInternal = (item) => {
  let internal = false;
  const links = item?.link || [];
  links.forEach((link) => {
    if (isInternalURL(link?.url)) {
      internal = true;
    }
  });
  return internal;
};

export const groupBy = (obj, key) => {
  return obj.reduce((rv, item) => {
    const group = rv[item[key]] || [];
    group.push(item);
    rv[item[key]] = group;
    return rv;
  }, {});
};

export function parseDatasets(children) {
  const all_datasets = children.map((v, e) => {
    let date;
    if (v.resourceTemporalExtentDetails) {
      const tc = v.resourceTemporalExtentDetails[0];
      const { start, end } = tc || {};
      const tc_start = start?.date
        ? new Date(Date.parse(start.date)).getFullYear()
        : '';
      const tc_end = end?.date
        ? new Date(Date.parse(end.date)).getFullYear()
        : '';
      if (tc_start === tc_end) {
        date = tc_start;
      } else {
        date = tc_start + '-' + tc_end;
      }
    } else {
      date = '';
    }

    return Object.assign({ temporalDateRange: date, ...v }, e);
  });

  const datasets = all_datasets.filter((v) => {
    return !(isObsolete(v.cl_status) || isInternal(v));
  });

  const archivedOrRestrictedDatasets = all_datasets.filter((v) => {
    return isObsolete(v.cl_status) || isInternal(v);
  });

  const groupDatasets = (items) => {
    const datasetsByCoverage = groupBy(items, 'temporalDateRange');

    const sortedDatasets = Object.keys(datasetsByCoverage).sort(
      function (a, b) {
        a = Math.max(...a.split('-'));
        b = Math.max(...b.split('-'));
        return b - a;
      },
    );

    const groupedDatasets = sortedDatasets.map((v, i) => {
      return { id: i, date: v, children: datasetsByCoverage[v] };
    });

    return groupedDatasets;
  };

  const groupedByTemporalCoverage = groupDatasets(datasets);
  const groupedByArchivedOrRestricted = groupDatasets(
    archivedOrRestrictedDatasets,
  );

  return {
    all_datasets,
    datasets,
    archivedOrRestrictedDatasets,
    groupedByTemporalCoverage,
    groupedByArchivedOrRestricted,
  };
}
