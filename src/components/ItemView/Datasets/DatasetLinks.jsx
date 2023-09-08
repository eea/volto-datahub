import { Icon, List } from 'semantic-ui-react';
import { SVGIcon } from '../utils.js';

import lockSVG from 'remixicon/icons/System/lock-line.svg';
import { isInternalURL } from '@eeacms/volto-datahub/utils';

export default function DatasetLinks({ dataset }) {
  return (dataset['WWW:LINK'] || []).map((item, i) => {
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
            {isInternalURL(item.url) && <SVGIcon name={lockSVG} size="20px" />}
          </div>
        </List.Content>
      </List.Item>
    );
  });
}
