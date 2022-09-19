import React from 'react';
import cx from 'classnames';
import { Label } from 'semantic-ui-react';
import { DateTime, StringList } from '@eeacms/search';
import { useAppConfig, ResultContext, firstWords } from '@eeacms/search';
import { Link } from 'react-router-dom';

const DatahubCardItem = (props) => {
  const { result } = props;
  const { appConfig } = useAppConfig();
  const { debugQuery } = appConfig;
  const { topic } = result._result || [];
  const [hovered, setHovered] = React.useState(false);

  let metaType = result.metaTypes || '';
  if (metaType.length === 0) {
    metaType = 'Others';
  }

  const classColLeft = result.hasImage ? 'col-left' : 'col-left no-image';
  const [resultId] = (result.href || '').split('/').reverse();

  return (
    <div
      className={cx('search-result', { hovered })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={classColLeft}>
        <div className="details">
          <h3>
            <Link
              to={{
                pathname: `/en/datahub/datahubitem-view/${resultId}`,
                state: {
                  fromPathname: window.location.pathname,
                  fromSearch: window.location.search,
                },
              }}
              title={result.title}
            >
              {firstWords(result.title, 12)}
            </Link>
            {result.isNew && (
              <Label className="new-item" horizontal>
                New
              </Label>
            )}
            {result.isExpired && (
              <Label className="archived-item" horizontal>
                Archived
              </Label>
            )}
          </h3>
          {props.children ? props.children : <ResultContext {...props} />}

          <div className="result-bottom">
            {topic ? (
              <div className="result-info">
                <span className="result-info-title">Topics: </span>
                <StringList value={topic.raw} />
              </div>
            ) : null}
            <div className="result-info">
              <span className="result-info-title">Published: </span>
              <DateTime format="DATE_MED" value={result.issued} />
            </div>
            <div className="result-info">
              <span className="result-info-title">Available formats: </span>
              [Icons]
            </div>
          </div>
        </div>
        {debugQuery && (
          <div>
            <div>Explanation:</div>
            <pre>{JSON.stringify(result.explanation, undefined, 2)}</pre>
          </div>
        )}
      </div>
      {result.hasImage ? (
        <div className="col-right">
          <a
            className={`centered fluid image img-thumbnail`}
            href={result.href}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt={result.title}
              src={result.thumbUrl}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default DatahubCardItem;

// {/* <SegmentedBreadcrumb */}
// {/*   href={result.href} */}
// {/*   short={true} */}
// {/*   maxChars={40} */}
// {/* /> */}
//
// {/*<div className="source">
//   <span>Source: </span>
//   <Link to={`/datahub/view/${resultId}`} title={result.title}>
//     <strong title={result.source} className="source">
//       {firstWords(
//         getTermDisplayValue({
//           vocab,
//           field: 'cluster_name',
//           term: result.source,
//         }),
//         8,
//       )}
//     </strong>
//   </Link>
//
//   {showControls && !isSmallScreen && (
//     <MoreLikeThisTrigger
//       view={Button}
//       className="mlt"
//       compact
//       color="green"
//       size="mini"
//       result={result}
//     >
//       more like this
//     </MoreLikeThisTrigger>
//   )}
//   {showControls && isSmallScreen && (
//     <Dropdown icon="ellipsis vertical">
//       <Dropdown.Menu className="mlt">
//         <MoreLikeThisTrigger result={result} view={Dropdown.Item}>
//           More like this
//         </MoreLikeThisTrigger>
//       </Dropdown.Menu>
//     </Dropdown>
//   )}
// </div>*/}
// Button,
// Dropdown
// import { DateTime } from 'luxon';
// import { useAppConfig, useWindowDimensions } from '@eeacms/search/lib/hocs';
// import { TagsList } from '@eeacms/search/components'; // SegmentedBreadcrumb,
// import { firstWords, getTermDisplayValue } from '@eeacms/search/lib/utils';
// import MoreLikeThisTrigger from '@eeacms/search/components/Result/MoreLikeThisTrigger';
// import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
// import ResultContext from '@eeacms/search/components/Result/ResultContext';
// import ContentClusters from '@eeacms/search/components/Result/ContentClusters';
// ContentClusters,
// useWindowDimensions,
// MoreLikeThisTrigger,
// TagsList,
// ExternalLink,
// getTermDisplayValue,
// showControls = true
// vocab = {},

// const { width } = useWindowDimensions();
// const isSmallScreen = width < 1000;
// const clusters = result.clusterInfo;
// console.log('result', result._result);
// const { pathname, search } = useLocation();
// {/*<div className="col-full">
//   <div className="meta">
//     <ContentClusters clusters={clusters} item={result} />
//     <div className="tags-list">
//       <TagsList value={result.tags} />
//     </div>
//   </div>
// </div>*/}
// {/* <div className="result-info">
//   <span className="result-info-title">Author: </span>
//   {result._result?.raw_value?.raw.Org}
// </div> */}
