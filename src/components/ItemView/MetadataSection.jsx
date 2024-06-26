import React from 'react';
import { Icon } from 'semantic-ui-react';

const EEA = 'European Environment Agency';

const MetadataSection = (props) => {
  const { item, appConfig, docid } = props;
  const { raw_value, organisation, rod } = item || {};
  const { merged_time_coverage_range } = raw_value?.raw || {};
  const org = !!organisation
    ? !Array.isArray(organisation?.raw)
      ? [organisation?.raw]
      : organisation?.raw
    : [];
  const organisations = org.filter((org) => org !== EEA);

  return (
    <>
      {(!!rod ||
        (!!organisations && organisations.length > 0) ||
        (merged_time_coverage_range &&
          merged_time_coverage_range?.length > 0)) && (
        <div className="dataset-container metadata-wrapper">
          <h2>More information</h2>

          <div className="metadata-list">
            {!!rod && (
              <div className="metadata-section">
                <h5>Reporting obligations (ROD)</h5>

                {Array.isArray(rod?.raw) ? (
                  <>
                    {rod?.raw.map((item, i) => {
                      return <div key={i}>{item}</div>;
                    })}
                  </>
                ) : (
                  <div>{rod?.raw}</div>
                )}
              </div>
            )}

            {!!organisations && organisations.length > 0 && (
              <div className="metadata-section">
                <h5>Organisation:</h5>

                {organisations.map((item, i) => {
                  return <div key={i}>{item}</div>;
                })}
              </div>
            )}

            {merged_time_coverage_range &&
              merged_time_coverage_range?.length > 0 && (
                <div className="metadata-section">
                  <h5>Temporal coverage:</h5>

                  {merged_time_coverage_range.map((tc, i) => {
                    const tc_start = tc.start || '';
                    const tc_end = tc.end || '';
                    return (
                      <React.Fragment key={i}>
                        <span>
                          {tc_start === tc_end && tc_start}
                          {tc_start !== tc_end && tc_start + ' - ' + tc_end}
                        </span>
                        {i !== merged_time_coverage_range.length - 1
                          ? ', '
                          : ' '}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      )}
      <div className="dataset-container">
        <div className="d-link">
          <Icon className="file pdf" />
          <a
            target="_blank"
            href={
              `${appConfig.indexBaseUrl}/catalogue/datahub/api/records/` +
              `${docid}/formatters/xsl-view?output=pdf&language=eng&approved=true`
            }
            rel="noopener"
          >
            Metadata Factsheet
          </a>
        </div>

        <div className="d-link">
          <Icon className="ri-external-link-line" />
          <a
            target="_blank"
            href={`${appConfig.indexBaseUrl}/catalogue/srv/eng/catalog.search#/metadata/${docid}`}
            rel="noopener"
          >
            Metadata catalogue
          </a>
        </div>
      </div>
    </>
  );
};

export default MetadataSection;
