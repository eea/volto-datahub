import React from 'react';
import { Icon, List, Accordion } from 'semantic-ui-react';

import servicesSVG from './icons/services.svg';

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

const Datasets = (props) => {
  const { item, appConfig } = props;
  const { children } = item?.raw_value?.raw || {};

  const [activeIndex, setActiveIndex] = React.useState(0);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  }

  const datasets = React.useMemo(
    () =>
      (children || []).sort(
        (a, b) =>
          new Date(b.publicationDateForResource).getTime() -
          new Date(a.publicationDateForResource).getTime(),
      ),
    [children],
  );

  //   console.log('result', item);
  //   console.log('children', children);

  return datasets && datasets.length > 0 ? (
    <>
      <h2>Data</h2>

      <Accordion>
        {datasets.map((dataset, index) => {
          const { resourceTemporalExtentDetails } = dataset;

          return (
            <>
              <Accordion.Title
                active={activeIndex === index}
                index={index}
                onClick={handleClick}
              >
                <span className="dataset-title">
                  {dataset.resourceTitleObject.default}
                  <span className="formats">
                    {(dataset.format || []).map((item, i) => {
                      return <span className="format-label">{item}</span>;
                    })}
                  </span>
                </span>
                <Icon className="ri-arrow-down-s-line" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === index}>
                <div className="dataset-content">
                  {resourceTemporalExtentDetails &&
                    resourceTemporalExtentDetails?.length > 0 && (
                      <div>
                        <strong>Temporal coverage: </strong>

                        {resourceTemporalExtentDetails.map((tc, i) => {
                          let tc_start = tc?.start?.date;
                          if (tc_start) {
                            tc_start = new Date(
                              Date.parse(tc_start),
                            ).getFullYear();
                          }
                          let tc_end = tc?.end?.date;
                          if (tc_end) {
                            tc_end = new Date(Date.parse(tc_end)).getFullYear();
                          }
                          tc_start = tc_start || '';
                          tc_end = tc_end || '';
                          return (
                            <>
                              <span>
                                {tc_start === tc_end && tc_start}
                                {tc_start !== tc_end &&
                                  tc_start + ' - ' + tc_end}
                              </span>
                              {i !== resourceTemporalExtentDetails.length - 1
                                ? ', '
                                : ' '}
                            </>
                          );
                        })}
                      </div>
                    )}

                  {dataset.resourceType[0] !== 'nonGeographicDataset' && (
                    <div className="dataset-pdf">
                      <div className="pdf-btn">
                        <Icon className="file pdf" />
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`${appConfig.indexBaseUrl}/catalogue/datahub/api/records/${dataset.metadataIdentifier}/formatters/xsl-view?output=pdf&language=eng&approved=true`}
                        >
                          PDF Factsheet
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {!!dataset.link && dataset.link.length > 0 ? (
                  <List divided relaxed>
                    {dataset.link
                      .filter((i) => i.protocol === 'WWW:URL')
                      .map((item, i) => {
                        return (
                          <List.Item>
                            <List.Content>
                              <div className="dataset-item">
                                <Icon className="download" />
                                <a href={item.url} className="item-link">
                                  <span>{item.name}</span>
                                </a>
                              </div>
                            </List.Content>
                            {item.description && (
                              <span
                                className="item-description"
                                title={item.description}
                              >
                                {item.description}
                              </span>
                            )}
                          </List.Item>
                        );
                      })}

                    {dataset.link
                      .filter((i) => i.protocol === 'WWW:LINK')
                      .map((item, i) => {
                        return (
                          <List.Item>
                            <List.Content>
                              <div className="dataset-item">
                                <Icon className="download" />
                                {item.name ? (
                                  <a href={item.url} className="item-link">
                                    {item.name}
                                  </a>
                                ) : (
                                  <a href={item.url} className="item-link">
                                    Download link
                                  </a>
                                )}
                              </div>
                            </List.Content>
                          </List.Item>
                        );
                      })}

                    {dataset.link
                      .filter(
                        (i) =>
                          i.protocol === 'EEA:FILEPATH' ||
                          i.protocol === 'EEA:FOLDERPATH',
                      )
                      .map((item, i) => {
                        return (
                          <List.Item>
                            <List.Content>
                              <div className="dataset-item">
                                <Icon className="download" />
                                <a href={item.url} className="item-link">
                                  WebDAV: {item.name || item.function}
                                </a>
                              </div>
                            </List.Content>
                          </List.Item>
                        );
                      })}

                    {dataset.link
                      .filter(
                        (i) =>
                          i.protocol === 'ESRI:REST' ||
                          i.protocol === 'OGC:WMS',
                      )
                      .map((item, i) => {
                        return (
                          <List.Item>
                            <List.Content>
                              <SVGIcon name={servicesSVG} size="18" />
                              {(item.name || item.description) && (
                                <span className="item-protocol">
                                  {item.protocol}:
                                </span>
                              )}
                              <a className="item-link" href={item.url}>
                                {item.name || item.description || item.protocol}
                              </a>
                            </List.Content>
                          </List.Item>
                        );
                      })}

                    {dataset.link
                      .filter((i) => i.protocol.includes('WWW:LINK'))
                      .map((item, i) => {
                        return (
                          <List.Item>
                            <List.Content>
                              <div className="dataset-item">
                                <Icon className="linkify" />
                                <a href={item.url} className="item-link">
                                  <span>{item.name || item.url}</span>
                                </a>
                              </div>
                            </List.Content>
                            {item.description && (
                              <span className="item-description">
                                {item.description}
                              </span>
                            )}
                          </List.Item>
                        );
                      })}
                  </List>
                ) : (
                  ''
                )}
              </Accordion.Content>
            </>
          );
        })}
      </Accordion>
    </>
  ) : null;
};

export default Datasets;
