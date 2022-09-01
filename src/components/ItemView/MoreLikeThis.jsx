import React from 'react';
import runRequest from '@eeacms/search/lib/runRequest';

function buildQuery(title, docid) {
  const body = {
    // _source: {
    //   include: ['label', 'about', ],
    // },
    size: 6,
    query: {
      bool: {
        must: [
          {
            more_like_this: {
              fields: ['label'],
              like: title,
              min_term_freq: 1,
              min_word_length: 3,
              max_query_terms: 35,
              analyzer: 'english',
              minimum_should_match: '70%',
            },
          },
        ],
        must_not: [
          {
            match: {
              about: docid,
            },
          },
        ],
      },
    },
  };
  return body;
}

const MoreLikeThis = (props) => {
  const { docid, title, appConfig } = props;

  const [similarDocs, setSimilarDocs] = React.useState();

  React.useEffect(() => {
    async function getSimilarDocs(docid, title, appConfig) {
      const query_body = buildQuery(title, docid);
      const resp = await runRequest(query_body, appConfig);
      setSimilarDocs(resp.body.hits.hits);
    }
    getSimilarDocs(docid, title, appConfig);
  }, [appConfig, docid, title]);
  return similarDocs && similarDocs.length > 0 ? (
    <div className="more-like-this">
      <h4>More like this</h4>
      <ul>
        {similarDocs.map((item, i) => {
          return (
            <li>
              <span>{item._source.label}</span>
              <span>{item._source.about}</span>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};

export default MoreLikeThis;
