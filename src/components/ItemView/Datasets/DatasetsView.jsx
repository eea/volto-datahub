import React from 'react';
import { isObsolete, isInternal, groupBy } from '../utils.js';
import DatasetsTab from './DatasetsTab';

const DatasetsView = (props) => {
  const { item, appConfig } = props;
  const { children } = item?.raw_value?.raw || {};

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

    const sortedDatasets = Object.keys(datasetsByCoverage).sort(function (
      a,
      b,
    ) {
      a = Math.max(...a.split('-'));
      b = Math.max(...b.split('-'));
      return b - a;
    });

    const groupedDatasets = sortedDatasets.map((v) => {
      return { date: v, children: datasetsByCoverage[v] };
    });

    return groupedDatasets;
  };

  const groupedByTemporalCoverage = groupDatasets(datasets);
  const groupedByArchivedOrRestricted = groupDatasets(
    archivedOrRestrictedDatasets,
  );

  return (
    <>
      <div className="dataset-container">
        <h2>Datasets</h2>
      </div>
      <DatasetsTab
        appConfig={appConfig}
        items={groupedByTemporalCoverage}
        defaultAccordionOpenIndex={0}
      />

      <div className="dataset-container">
        <h2>Archived or restricted datasets</h2>
      </div>
      <DatasetsTab
        appConfig={appConfig}
        items={groupedByArchivedOrRestricted}
      />
    </>
  );
};

export default DatasetsView;
