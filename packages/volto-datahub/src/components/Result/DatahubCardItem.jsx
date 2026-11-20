import React from 'react';

import { Label } from 'semantic-ui-react';
import { DateTime, StringList, ResultContext } from '@eeacms/search';
import { Link } from 'react-router-dom';
import { UniversalCard } from '@eeacms/volto-listing-block';

const DatahubCardItem = (props) => {
  const { result } = props;
  const { topic, dataset_formats } = result._result || [];

  const item = {
    title: (
      <>
        <Link to={result.href} title={result.title}>
          {result.title}
          {result.isNew && <Label className="new-item">New</Label>}
          {result.isExpired && (
            <Label className="archived-item">Archived</Label>
          )}
        </Link>
      </>
    ),
    description: <ResultContext {...props} />,
    preview_image_url: result.hasImage ? result.thumbUrl : undefined,
    extra: (
      <div className="result-bottom">
        <div className="result-info">
          <DateTime format="DATE_MED" value={result.issued} />
        </div>
        {topic ? (
          <div className="result-info">
            <span className="result-info-title">Topics: </span>
            <StringList value={topic.raw} />
          </div>
        ) : null}
        {dataset_formats ? (
          <div className="result-info">
            <span className="result-info-title">Available formats: </span>
            <StringList value={dataset_formats.raw} />
          </div>
        ) : null}
      </div>
    ),
  };

  const itemModel = {
    hasImage: result.hasImage,
    hasDescription: true,
    '@type': 'searchItem',
  };

  return <UniversalCard item={item} itemModel={itemModel} />;
};

export default DatahubCardItem;
