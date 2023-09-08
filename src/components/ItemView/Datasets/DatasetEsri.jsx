import { List } from 'semantic-ui-react';
import { SVGIcon } from '../utils.js';

import lockSVG from 'remixicon/icons/System/lock-line.svg';
import { isInternalURL } from '@eeacms/volto-datahub/utils';
import servicesSVG from '../icons/services.svg';

export default function DatasetEsri({ dataset }) {
  return (
    (dataset['ESRI:REST'] || dataset['OGC:WMS']) && (
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
    )
  );
}
