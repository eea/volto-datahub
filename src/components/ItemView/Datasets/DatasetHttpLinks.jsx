import { Icon, List } from 'semantic-ui-react';
import { isInternalURL } from '@eeacms/volto-datahub/utils';
import { SVGIcon } from '../utils.js';

import lockSVG from 'remixicon/icons/System/lock-line.svg';

export default function DatasetHttpLinks({ dataset }) {
  return dataset['WWW:LINK-1.0-http--link'] || dataset['DOI'] ? (
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
                  {isInternalURL(item.url) ? (
                    <SVGIcon name={lockSVG} size="20px" />
                  ) : null}
                </div>
              </List.Content>
              {item.description ? (
                <span className="item-description">{item.description}</span>
              ) : null}
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
                  {isInternalURL(item.url) ? (
                    <SVGIcon name={lockSVG} size="20px" />
                  ) : null}
                </div>
              </List.Content>
              {item.description ? (
                <span className="item-description">{item.description}</span>
              ) : null}
            </List.Item>
          );
        })}
      </List>
    </>
  ) : null;
}
