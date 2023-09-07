import React from 'react';
import { Icon, List } from 'semantic-ui-react';
import { SVGIcon } from '../utils.js';

import servicesSVG from '../icons/services.svg';
import lockSVG from 'remixicon/icons/System/lock-line.svg';
import { isInternalURL, groupBy } from '@eeacms/volto-datahub/utils';

const DatasetItemDownloadList = (props) => {
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
                      {isInternalURL(item.url) && (
                        <SVGIcon name={lockSVG} size="20px" />
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
                      {isInternalURL(item.url) && (
                        <SVGIcon name={lockSVG} size="20px" />
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
                      <SVGIcon name={servicesSVG} size="20px" />
                      <a
                        className="item-link"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.protocol} {item.name || item.description}
                      </a>
                      {isInternalURL(item.url) && (
                        <SVGIcon name={lockSVG} size="20px" />
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
                      <SVGIcon name={servicesSVG} size="20px" />
                      <a
                        className="item-link"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.protocol} {item.name || item.description}
                      </a>
                      {isInternalURL(item.url) && (
                        <SVGIcon name={lockSVG} size="20px" />
                      )}
                    </div>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        </>
      )}

      {(dataset['WWW:LINK-1.0-http--link'] || dataset['DOI']) && (
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
                      {isInternalURL(item.url) && (
                        <SVGIcon name={lockSVG} size="20px" />
                      )}
                    </div>
                  </List.Content>
                  {item.description && (
                    <span className="item-description">{item.description}</span>
                  )}
                </List.Item>
              );
            })}
            {(dataset['DOI'] || []).map((item, i) => {
              return (
                <List.Item key={i}>
                  <List.Content>
                    <div className="dataset-item">
                      <Icon className="info circle" />
                      <a
                        href={item.url}
                        className="item-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{item.name || item.url}</span>
                      </a>
                      {isInternalURL(item.url) && (
                        <SVGIcon name={lockSVG} size="20px" />
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

export default DatasetItemDownloadList;
