import React from 'react';
import { Accordion } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import { DateTime } from '@eeacms/search';
import { isInternal, SVGIcon, isObsolete } from '../utils.js';
import DatasetItemDownloadList from './DatasetItemDownloadList';

import AnimateHeight from 'react-animate-height';

import lockSVG from 'remixicon/icons/System/lock-line.svg';

import { useLocation, useHistory } from 'react-router-dom';

const useQuery = (location) => {
  const { search } = location;
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const DatasetItemsList = (props) => {
  const { appConfig, item, setActiveAccordion } = props;

  const location = useLocation();
  const history = useHistory();
  const query = useQuery(location);
  const { search } = useLocation();

  const activePanels = query.get('activeAccordion')?.split(',') || [];
  const [itemToScroll, setItemToScroll] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState([]);
  const [activePanel, setActivePanel] = React.useState([]);
  const activePanelsRef = React.useRef(activePanels);

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
    setActiveIndex(index);
    setActivePanel(id);
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

  React.useEffect(() => {
    const firstAccordion = item?.children?.[0].id;
    if (activePanel.length < 1) {
      setActivePanel([firstAccordion]);
    }
  }, [activePanel.length, item.children]);

  React.useEffect(() => {
    !!activePanelsRef.current &&
      setItemToScroll(
        activePanelsRef.current[activePanelsRef.current?.length - 1],
      );
  }, []);

  React.useEffect(() => {
    setActivePanel(activePanelsRef.current || []);
  }, []);

  return (
    <Accordion>
      {item?.children.map((dataset, index) => {
        const {
          id,
          resourceTemporalExtentDetails,
          temporalDateRange,
          publicationDateForResource,
        } = dataset;
        const archived = isObsolete(dataset.cl_status);

        return (
          <div key={index} id={id}>
            <Accordion.Title
              tabIndex={0}
              active={isActive(id)}
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
            <AnimateHeight
              animateOpacity
              duration={500}
              height={isActive(id) ? 'auto' : 0}
              onTransitionEnd={() => {
                if (!!activePanels && id === itemToScroll) {
                  setItemToScroll('');
                  scrollToElement();
                }
              }}
            >
              <Accordion.Content active={isActive(id)}>
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
            </AnimateHeight>
          </div>
        );
      })}
    </Accordion>
  );
};

export default DatasetItemsList;
