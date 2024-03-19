import { List } from 'semantic-ui-react';
import { SVGIcon } from '../utils.js';

import lockSVG from 'remixicon/icons/System/lock-line.svg';
import { isInternalURL } from '@eeacms/volto-datahub/utils';
import servicesSVG from '../icons/services.svg';

const ItemLink = ({ item }) => (
  <List.Item key={item.id}>
    <List.Content>
      <div className="dataset-item">
        <SVGIcon name={servicesSVG} size="20px" />
        <a className="item-link" href={item.url} target="_blank" rel="noopener">
          {item.protocol} {item.name || item.description}
        </a>
        {isInternalURL(item.url) ? (
          <SVGIcon name={lockSVG} size="20px" />
        ) : null}
      </div>
    </List.Content>
  </List.Item>
);

export default function DatasetEsri({ dataset }) {
  return dataset['ESRI:REST'] || dataset['OGC:WMS'] ? (
    <>
      <h5>Services:</h5>
      <List divided relaxed>
        {[...(dataset['ESRI:REST'] || []), ...(dataset['OGC:WMS'] || [])].map(
          (item, i) => (
            <ItemLink item={item} key={item.id} />
          ),
        )}
      </List>
    </>
  ) : null;
}
