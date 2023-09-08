import React from 'react';
import config from '@plone/volto/registry';
import { Accordion, Icon } from 'semantic-ui-react';
import { useLocation, useHistory } from 'react-router-dom';

import { DateTime } from '@eeacms/search';
import { AccordionFilter } from '@eeacms/volto-accordion-block/components';

import { SVGIcon } from '../utils.js';
import DatasetItemDownloadList from './DatasetItemDownloadList';
import { isInternal, isObsolete } from '@eeacms/volto-datahub/utils';

import lockSVG from 'remixicon/icons/System/lock-line.svg';

const useQuery = (location) => {
  const { search } = location;
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const DatasetItemsList = (props) => {
  const {
    item,
    appConfig,
    filterValue,
    setActiveTabIndex,
    setActiveAccordionId,
    setInitialAccordionId,
    handleFilteredValueChange,
  } = props;

  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location);

  const datasets = item?.children;
  const firstIdFromPanels = datasets?.[0]?.id;
  const accordionConfig = config.blocks.blocksConfig.accordion;
  const activePanels = query.get('activeAccordion')?.split(',') || [];

  const [activeIndex, setActiveIndex] = React.useState([]);
  const [activePanel, setActivePanel] = React.useState([]);

  const activePanelsRef = React.useRef(activePanels);
  const firstIdFromPanelsRef = React.useRef(firstIdFromPanels);

  React.useEffect(() => {
    setInitialAccordionId(
      activePanelsRef.current[activePanelsRef.current.length - 1],
    );
  }, [setInitialAccordionId]);

  const addQueryParam = (key, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);

    history.push({
      hash: location.hash,
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleActiveIndex = (index, id) => {
    setActivePanel(id);
    setActiveIndex(index);
    addQueryParam('activeAccordion', id);
  };

  const isActive = (id) => {
    return activePanel.includes(id);
  };

  const handleClick = (e, titleProps) => {
    const { index, id, item } = titleProps;

    const newIndex =
      activeIndex.indexOf(index) === -1
        ? [...activeIndex, index]
        : activeIndex.filter((item) => item !== index);

    const newPanel =
      activePanel.indexOf(id) === -1
        ? [...activePanel, id]
        : activePanel.filter((item) => item !== id);

    setActiveAccordionId(id);
    setActiveTabIndex(item.id);
    handleActiveIndex(newIndex, newPanel);
  };

  React.useEffect(() => {
    if (!!activePanelsRef.current && !!activePanelsRef?.current[0]?.length) {
      setActivePanel(activePanelsRef.current || []);
    } else {
      setActivePanel([
        firstIdFromPanelsRef.current,
        ...(activePanelsRef.current || []),
      ]);
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const activeAccordionId =
        activePanelsRef?.current[activePanelsRef?.current.length - 1];
      const element = document.getElementById(activeAccordionId);
      element &&
        element.scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="accordion-block">
        {datasets.length > 5 && (
          <AccordionFilter
            config={accordionConfig}
            filterValue={filterValue}
            data={{ right_arrows: true, styles: {} }}
            handleFilteredValueChange={handleFilteredValueChange}
          />
        )}
      </div>
      {datasets
        .filter(
          (dataset) =>
            filterValue === '' ||
            (filterValue !== '' &&
              dataset.resourceTitleObject.default
                ?.toLowerCase()
                .includes(filterValue.toLowerCase())),
        )
        .map((dataset, index) => {
          const {
            id,
            resourceTemporalExtentDetails,
            temporalDateRange,
            publicationDateForResource,
          } = dataset;
          const archived = isObsolete(dataset.cl_status);
          const active = isActive(id);

          return (
            <>
              <Accordion id={id} key={index}>
                <Accordion.Title
                  role="button"
                  tabIndex={0}
                  active={active}
                  aria-expanded={active}
                  index={index}
                  onClick={(e) => handleClick(e, { index, id, item })}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 || e.keyCode === 32) {
                      e.preventDefault();
                      handleClick(e, { index, id, item });
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
                            .filter(
                              (i) => i.includes('ESRI') || i.includes('OGC'),
                            )
                            .filter(
                              (item, pos, self) => self.indexOf(item) === pos,
                            )
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
                            <span className="dh-label">
                              {dataset.linkProtocol}
                            </span>
                          )}
                        </>
                      )}

                      {archived && (
                        <span className="dh-label inverted">Archived</span>
                      )}

                      {isInternal(dataset) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </span>
                  </span>
                  {active ? (
                    <Icon className="ri-arrow-up-s-line" />
                  ) : (
                    <Icon className="ri-arrow-down-s-line" />
                  )}
                </Accordion.Title>
                <Accordion.Content active={active}>
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
                            href={
                              `${appConfig.indexBaseUrl}/catalogue/datahub/api/records/` +
                              `${dataset.metadataIdentifier}/formatters/xsl-view?output=pdf&language=eng&approved=true`
                            }
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
              </Accordion>
            </>
          );
        })}
    </>
  );
};

export default DatasetItemsList;
