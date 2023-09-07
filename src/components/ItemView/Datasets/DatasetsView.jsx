import React from 'react';
import DatasetsTab from './DatasetsTab';
import { parseDatasets } from '@eeacms/volto-datahub/utils';

const DatasetsView = (props) => {
  const { item, appConfig } = props;
  const { children } = item?.raw_value?.raw || {};
  const {
    groupedByTemporalCoverage,
    groupedByArchivedOrRestricted,
  } = parseDatasets(children);

  return (
    <>
      {groupedByTemporalCoverage && groupedByTemporalCoverage.length > 0 && (
        <>
          <div className="dataset-container">
            <h2>Datasets</h2>
          </div>
          <DatasetsTab
            appConfig={appConfig}
            items={groupedByTemporalCoverage}
          />
        </>
      )}

      {groupedByArchivedOrRestricted &&
        groupedByArchivedOrRestricted.length > 0 && (
          <>
            <div className="dataset-container">
              <h2>Archived or restricted datasets</h2>
            </div>
            <DatasetsTab
              appConfig={appConfig}
              items={groupedByArchivedOrRestricted}
            />
          </>
        )}
    </>
  );
};

export default DatasetsView;
