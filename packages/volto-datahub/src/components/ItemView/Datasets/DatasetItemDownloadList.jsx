import React from 'react';
import { List } from 'semantic-ui-react';

import { groupBy } from '@eeacms/volto-datahub/utils';
import DatasetUrls from './DatasetUrls';
import DatasetLinks from './DatasetLinks';
import DatasetEsri from './DatasetEsri';
import DatasetHttpLinks from './DatasetHttpLinks';

const DatasetItemDownloadList = (props) => {
  const { link } = props;
  const dataset = groupBy(link, 'protocol');
  const showDownload = !!(
    dataset['WWW:URL'] ||
    dataset['WWW:LINK'] ||
    dataset['EEA:FILEPATH'] ||
    dataset['EEA:FOLDERPATH']
  );

  return (
    <div>
      {showDownload ? (
        <>
          <h5>Download:</h5>
          <List divided relaxed>
            <DatasetUrls dataset={dataset} />
            <DatasetLinks dataset={dataset} />
          </List>
        </>
      ) : null}

      <DatasetEsri dataset={dataset} />
      <DatasetHttpLinks dataset={dataset} />
    </div>
  );
};

export default DatasetItemDownloadList;
