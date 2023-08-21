import React from 'react';
import config from '@plone/volto/registry';
import { Accordion, Icon } from 'semantic-ui-react';
import AnimateHeight from 'react-animate-height';
import { useLocation, useHistory } from 'react-router-dom';

import { DateTime } from '@eeacms/search';
import { AccordionFilter } from '@eeacms/volto-accordion-block/components';

import { isInternal, SVGIcon, isObsolete } from '../utils.js';
import DatasetItemDownloadList from './DatasetItemDownloadList';

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
    setActiveAccordion,
    handleFilteredValueChange,
  } = props;

  const history = useHistory();
  const location = useLocation();
  const query = useQuery(location);
  const { search } = useLocation();

  const datasets = item?.children;
  const firstIdFromPanels = datasets?.[0]?.id;
  const accordionConfig = config.blocks.blocksConfig.accordion;
  const activePanels = query.get('activeAccordion')?.split(',') || [];

  const [activeIndex, setActiveIndex] = React.useState([]);
  const [activePanel, setActivePanel] = React.useState([]);
  const [itemToScroll, setItemToScroll] = React.useState('');

  const activePanelsRef = React.useRef(activePanels);
  const firstIdFromPanelsRef = React.useRef(firstIdFromPanels);

  const addQueryParam = (key, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);

    history.push({
      hash: location.hash,
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  React.useEffect(() => {
    const query = new URLSearchParams(search);
    const panels = query.get('activeAccordion')?.split(',') || [];
    setActiveAccordion(panels);
  }, [search, setActiveAccordion]);

  const handleClick = (e, titleProps) => {
    const { index, id } = titleProps;

    const newIndex =
      activeIndex.indexOf(index) === -1
        ? [...activeIndex, index]
        : activeIndex.filter((item) => item !== index);

    const newPanel =
      activePanel.indexOf(id) === -1
        ? [...activePanel, id]
        : activePanel.filter((item) => item !== id);

    handleActiveIndex(newIndex, newPanel);
  };

  const handleActiveIndex = (index, id) => {
    setActivePanel(id);
    setActiveIndex(index);
    addQueryParam('activeAccordion', id);
  };

  const scrollToElement = () => {
    if (!!activePanels && !!activePanels[0].length) {
      let element = document.getElementById(
        activePanels[activePanels.length - 1],
      );
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (id) => {
    return activePanel.includes(id);
  };

  // React.useEffect(() => {
  //   const firstAccordion = datasets?.[0].id;
  //   if (activePanel.length < 1) {
  //     setActivePanel([firstAccordion]);
  //   }
  // }, [activePanel.length, item.children]);

  React.useEffect(() => {
    !!activePanelsRef.current &&
      setItemToScroll(
        activePanelsRef.current[activePanelsRef.current?.length - 1],
      );
  }, []);

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
                  tabIndex={0}
                  active={active}
                  index={index}
                  onClick={(e) => handleClick(e, { index, id })}
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
                  <Icon className="ri-arrow-down-s-line" />
                </Accordion.Title>
                <AnimateHeight
                  animateOpacity
                  duration={500}
                  height={active ? 'auto' : 0}
                  onTransitionEnd={() => {
                    if (!!activePanels && id === itemToScroll) {
                      setItemToScroll('');
                      scrollToElement();
                    }
                  }}
                >
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
                </AnimateHeight>
              </Accordion>
            </>
          );
        })}
    </>
  );
};

export default DatasetItemsList;
