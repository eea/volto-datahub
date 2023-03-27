import React from 'react';

import { Label } from 'semantic-ui-react';
import { DateTime, StringList } from '@eeacms/search';
import { ResultContext } from '@eeacms/search';
import { Link } from 'react-router-dom';
import { UniversalCard } from '@eeacms/volto-listing-block';

const DatahubCardItem = (props) => {
  const { result } = props;
  const { topic, dataset_formats } = result._result || [];

  // let metaType = result.metaTypes || '';
  // if (metaType.length === 0) {
  //   metaType = 'Others';
  // }

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
          {/* <span className="result-info-title">Published: </span> */}
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

//  <div
//    className={cx('search-result', { hovered })}
//    onMouseEnter={() => setHovered(true)}
//    onMouseLeave={() => setHovered(false)}
//  >
//    <div className={classColLeft}>
//      <div className="details">
//        <h3>
//          <Link
//            to={{
//              pathname: `/en/datahub/datahubitem-view/${resultId}`,
//              state: {
//                fromPathname: window.location.pathname,
//                fromSearch: window.location.search,
//              },
//            }}
//            title={result.title}
//          >
//            {firstWords(result.title, 12)}
//          </Link>
//          {result.isNew && (
//            <Label className="new-item" horizontal>
//              New
//            </Label>
//          )}
//          {result.isExpired && (
//            <Label className="archived-item" horizontal>
//              Archived
//            </Label>
//          )}
//        </h3>
//        {props.children ? props.children : <ResultContext {...props} />}

//        <div className="result-bottom">
//          {topic ? (
//            <div className="result-info">
//              <span className="result-info-title">Topics: </span>
//              <StringList value={topic.raw} />
//            </div>
//          ) : null}
//          <div className="result-info">
//            <span className="result-info-title">Published: </span>
//            <DateTime format="DATE_MED" value={result.issued} />
//          </div>
//          <div className="result-info">
//            <span className="result-info-title">Available formats: </span>
//            [Icons]
//          </div>
//        </div>
//      </div>
//      {debugQuery && (
//        <div>
//          <div>Explanation:</div>
//          <pre>{JSON.stringify(result.explanation, undefined, 2)}</pre>
//        </div>
//      )}
//    </div>
//    {result.hasImage ? (
//      <div className="col-right">
//        <a
//          className={`centered fluid image img-thumbnail`}
//          href={result.href}
//          target="_blank"
//          rel="noreferrer"
//        >
//          <img
//            alt={result.title}
//            src={result.thumbUrl}
//            onError={(e) => {
//              e.target.style.display = 'none';
//            }}
//          />
//        </a>
//      </div>
//    ) : null}
//  </div>

export default DatahubCardItem;
