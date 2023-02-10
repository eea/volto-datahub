import React from 'react';
import { Icon, List, Accordion, Tab, Menu } from 'semantic-ui-react';
import { DateTime } from '@eeacms/search';
import servicesSVG from './icons/services.svg';
import lockSVG from 'remixicon/icons/System/lock-line.svg';

const is_internal_url = (url) => {
  let internal = false;
  url.split('/').forEach((part) => {
    if (part.split('_')[6] === 'i') {
      internal = true;
    }
  });
  return internal;
};

const is_internal = (dataset) => {
  let internal = false;
  const links = dataset?.link || [];
  links.forEach((link) => {
    if (is_internal_url(link?.url)) {
      internal = true;
    }
  });
  return internal;
};

const groupBy = (obj, key) => {
  return obj.reduce((rv, item) => {
    const group = rv[item[key]] || [];
    group.push(item);
    rv[item[key]] = group;
    return rv;
  }, {});
};

const SVGIcon = ({ name, size, color, className, title, onClick }) => {
  return (
    <svg
      xmlns={name.attributes && name.attributes.xmlns}
      viewBox={name.attributes && name.attributes.viewBox}
      style={{ height: size, width: 'auto', fill: color || 'currentColor' }}
      className={className ? `icon ${className}` : 'icon'}
      onClick={onClick}
      dangerouslySetInnerHTML={{
        __html: title ? `<title>${title}</title>${name.content}` : name.content,
      }}
    />
  );
};

const DatasetList = (props) => {
  const { link } = props;
  const dataset = groupBy(link, 'protocol');

  return (
    <div>
      {(dataset['WWW:URL'] ||
        dataset['WWW:LINK'] ||
        dataset['EEA:FILEPATH'] ||
        dataset['EEA:FOLDERPATH']) && (
        <>
          <h5>Download:</h5>
          <List divided relaxed>
            {(dataset['WWW:URL'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div className="dataset-item">
                      <Icon className="download" />
                      <a
                        href={item.url}
                        className="item-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{item.name}</span>
                      </a>
                      {is_internal_url(item.url) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </div>
                  </List.Content>
                  {item.description && (
                    <span className="item-description" title={item.description}>
                      {item.description}
                    </span>
                  )}
                </List.Item>
              );
            })}

            {(dataset['WWW:LINK'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div className="dataset-item">
                      <Icon className="download" />
                      {item.name ? (
                        <a
                          href={item.url}
                          className="item-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <a
                          href={item.url}
                          className="item-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download link
                        </a>
                      )}
                      {is_internal_url(item.url) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </div>
                  </List.Content>
                </List.Item>
              );
            })}

            {(dataset['EEA:FILEPATH'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div className="dataset-item">
                      <Icon className="download" />
                      <a
                        href={item.url}
                        className="item-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        WebDAV: {item.name || item.function}
                      </a>
                      {is_internal_url(item.url) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </div>
                  </List.Content>
                </List.Item>
              );
            })}

            {(dataset['EEA:FOLDERPATH'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div className="dataset-item">
                      <Icon className="download" />
                      <a
                        href={item.url}
                        className="item-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        WebDAV: {item.name || item.function}
                      </a>
                      {is_internal_url(item.url) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </div>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        </>
      )}

      {(dataset['ESRI:REST'] || dataset['OGC:WMS']) && (
        <>
          <h5>Services:</h5>
          <List divided relaxed>
            {(dataset['ESRI:REST'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div>
                      <SVGIcon name={servicesSVG} size="18" />
                      {/* {(item.name || item.description) && (
                        <span className="item-protocol">{item.protocol}:</span>
                      )} */}
                      <a
                        className="item-link"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.protocol} {item.name || item.description}
                      </a>
                      {is_internal_url(item.url) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </div>
                  </List.Content>
                </List.Item>
              );
            })}

            {(dataset['OGC:WMS'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div>
                      <SVGIcon name={servicesSVG} size="18" />
                      {/* {(item.name || item.description) && (
                          <span className="item-protocol">{item.protocol}:</span>
                        )} */}
                      <a
                        className="item-link"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.protocol} {item.name || item.description}
                      </a>
                      {is_internal_url(item.url) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </div>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        </>
      )}

      {dataset['WWW:LINK-1.0-http--link'] && (
        <>
          <h5>Links:</h5>
          <List divided relaxed>
            {(dataset['WWW:LINK-1.0-http--link'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div className="dataset-item">
                      <Icon className="linkify" />
                      <a
                        href={item.url}
                        className="item-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{item.name || item.url}</span>
                      </a>
                      {is_internal_url(item.url) && (
                        <SVGIcon name={lockSVG} size="18" />
                      )}
                    </div>
                  </List.Content>
                  {item.description && (
                    <span className="item-description">{item.description}</span>
                  )}
                </List.Item>
              );
            })}
          </List>
        </>
      )}
    </div>
  );
};

const Datasets = (props) => {
  const { item, appConfig } = props;
  const { children } = item?.raw_value?.raw || {};

  const [activeIndex, setActiveIndex] = React.useState(-1);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  }

  const datasets = children.map((v, e) => {
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

  const datasetsByCoverage = groupBy(datasets, 'temporalDateRange');

  const sortedDatasets = Object.keys(datasetsByCoverage).sort(function (a, b) {
    a = Math.max(...a.split('-'));
    b = Math.max(...b.split('-'));
    return b - a;
  });

  const groupedDatasets = sortedDatasets.map((v) => {
    return { date: v, children: datasetsByCoverage[v] };
  });

  const panes = (groupedDatasets || []).map((item, i) => ({
    menuItem: (
      <Menu.Item>{item.date ? <span>{item.date}</span> : 'No date'}</Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        <Accordion>
          {item?.children.map((dataset, index) => {
            const {
              resourceTemporalExtentDetails,
              temporalDateRange,
              publicationDateForResource,
            } = dataset;
            return (
              <React.Fragment key={index}>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={handleClick}
                >
                  <span className="dataset-title">
                    {dataset.resourceTitleObject.default}
                    <span className="formats">
                      {(dataset.format || []).map((item, i) => {
                        return (
                          <span className="format-label" key={i}>
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
                            .map((item, i) => {
                              return (
                                <span className="format-label" key={i}>
                                  {item}
                                </span>
                              );
                            })}
                        </>
                      ) : (
                        <>
                          {['ESRI', 'OGC'].includes(dataset.linkProtocol) && (
                            <span className="format-label">
                              {dataset.linkProtocol}
                            </span>
                          )}
                        </>
                      )}
                    </span>

                    {is_internal(dataset) && (
                      <SVGIcon name={lockSVG} size="18" />
                    )}
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
                    <DatasetList link={dataset.link} />
                  )}
                </Accordion.Content>
              </React.Fragment>
            );
          })}
        </Accordion>
      </Tab.Pane>
    ),
  }));

  return children && children.length > 0 ? (
    <>
      <div className="dataset-container">
        <h2>Datasets</h2>
      </div>

      <div className="item tabs-title">Temporal coverage</div>
      <Tab
        className="datasets-tab"
        menu={{ vertical: true, secondary: true, pointing: true }}
        panes={panes}
      />
    </>
  ) : null;
};

export default Datasets;
