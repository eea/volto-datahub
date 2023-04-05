import React from 'react';
import { Accordion } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import { DateTime } from '@eeacms/search';
import { isInternal, SVGIcon, isObsolete } from '../utils.js';
import DatasetItemDownloadList from './DatasetItemDownloadList';

import lockSVG from 'remixicon/icons/System/lock-line.svg';

const DatasetItemsList = (props) => {
  const { appConfig, item, setActiveTabIndex, activeTabIndex } = props;

  const [activeIndex, setActiveIndex] = React.useState(activeTabIndex);

  React.useEffect(() => {
    setActiveIndex(activeTabIndex);
  }, [activeTabIndex]);

  React.useEffect(() => {
    setActiveTabIndex(activeIndex);
  }, [activeIndex, setActiveTabIndex]);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  }

  return (
    <Accordion>
      {item?.children.map((dataset, index) => {
        const {
          resourceTemporalExtentDetails,
          temporalDateRange,
          publicationDateForResource,
        } = dataset;
        const archived = isObsolete(dataset.cl_status);

        return (
          <React.Fragment key={index}>
            <Accordion.Title
              tabIndex={0}
              active={activeIndex === index}
              index={index}
              onClick={handleClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleClick(e, { index });
                }
              }}
            >
              <span className="dataset-title">
                {dataset.resourceTitleObject.default}

                <span className="formats">
                  {(dataset.format || [])
                    .filter((item, pos, self) => self.indexOf(item) === pos)
                    .map((item, i) => {
                      return (
                        <span className="dh-label" key={i}>
                          {item}
                        </span>
                      );
                    })}

                  {Array.isArray(dataset.linkProtocol) ? (
                    <>
                      {dataset.linkProtocol
                        .filter((i) => i.includes('ESRI') || i.includes('OGC'))
                        .filter((item, pos, self) => self.indexOf(item) === pos)
                        .map((item, i) => {
                          return (
                            <span className="dh-label" key={i}>
                              {item}
                            </span>
                          );
                        })}
                    </>
                  ) : (
                    <>
                      {['ESRI', 'OGC'].includes(dataset.linkProtocol) && (
                        <span className="dh-label">{dataset.linkProtocol}</span>
                      )}
                    </>
                  )}

                  {archived && (
                    <span className="dh-label inverted">Archived</span>
                  )}

                  {isInternal(dataset) && <SVGIcon name={lockSVG} size="18" />}
                </span>
              </span>
              <Icon className="ri-arrow-down-s-line" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
              <div className="dataset-content">
                <div>
                  {publicationDateForResource && (
                    <div>
                      <strong>Published: </strong>
                      <DateTime
                        format="DATE_MED"
                        value={publicationDateForResource}
                      />
                    </div>
                  )}

                  {resourceTemporalExtentDetails &&
                    resourceTemporalExtentDetails?.length > 0 && (
                      <div>
                        <strong>Temporal coverage: </strong>
                        {temporalDateRange}
                      </div>
                    )}
                </div>

                {dataset.resourceType[0] !== 'nonGeographicDataset' && (
                  <div className="dataset-pdf">
                    <div className="d-link">
                      <Icon className="file pdf" />
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`${appConfig.indexBaseUrl}/catalogue/datahub/api/records/${dataset.metadataIdentifier}/formatters/xsl-view?output=pdf&language=eng&approved=true`}
                      >
                        Metadata Factsheet
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {!!dataset.link && dataset.link.length > 0 && (
                <DatasetItemDownloadList link={dataset.link} />
              )}
            </Accordion.Content>
          </React.Fragment>
        );
      })}
    </Accordion>
  );
};

export default DatasetItemsList;
