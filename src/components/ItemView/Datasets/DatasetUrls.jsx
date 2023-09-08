import { Icon, List } from 'semantic-ui-react';
import { SVGIcon } from '../utils.js';

import lockSVG from 'remixicon/icons/System/lock-line.svg';
import { isInternalURL } from '@eeacms/volto-datahub/utils';

export default function DatasetUrls({ dataset }) {
  return (dataset['WWW:URL'] || []).map((item, i) => {
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
            {isInternalURL(item.url) && <SVGIcon name={lockSVG} size="20px" />}
          </div>
        </List.Content>
        {item.description && (
          <span className="item-description" title={item.description}>
            {item.description}
          </span>
        )}
      </List.Item>
    );
  });
}
