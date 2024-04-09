import { Icon, List } from 'semantic-ui-react';
import { isInternalURL } from '@eeacms/volto-datahub/utils';
import { SVGIcon } from '../utils.js';

import lockSVG from 'remixicon/icons/System/lock-line.svg';

const renderListItem = (item, index, iconClass) => (
  <List.Item key={index}>
    <List.Content>
      <div className="dataset-item">
        <Icon className={iconClass} />
        <a href={item.url} className="item-link" target="_blank" rel="noopener">
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

export default function DatasetHttpLinks({ dataset }) {
  return dataset['WWW:LINK-1.0-http--link'] || dataset['DOI'] ? (
    <>
      <h5>Links:</h5>
      <List divided relaxed>
        {(dataset['WWW:LINK-1.0-http--link'] || []).map((item, i) =>
          renderListItem(item, i, 'linkify'),
        )}
        {(dataset['DOI'] || []).map((item, i) =>
          renderListItem(item, i, 'info circle'),
        )}
      </List>
    </>
  ) : null;
}
