import React from 'react';
import { Card } from 'semantic-ui-react';
import { runRequest, firstWords } from '@eeacms/search';

function buildQuery(title, docid, index_name) {
  const body = {
    // _source: {
    //   include: ['label', 'about', ],
    // },
    size: 3,
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
    ...(index_name ? { index: index_name } : {}),
  };
  return body;
}

const MoreLikeThis = (props) => {
  const { docid, title, appConfig } = props;
  const [similarDocs, setSimilarDocs] = React.useState();

  React.useEffect(() => {
    async function getSimilarDocs(docid, title, appConfig) {
      const { index_name } = appConfig;
      const query_body = buildQuery(title, docid, index_name);
      const resp = await runRequest(query_body, appConfig);
      setSimilarDocs(resp.body?.hits?.hits);
    }
    getSimilarDocs(docid, title, appConfig);
  }, [appConfig, docid, title]);

  return similarDocs && similarDocs.length > 0 ? (
    <div className="more-like-this">
      <h2>Similar content</h2>
      <div className="section-wrapper">
        <Card.Group itemsPerRow={3}>
          {similarDocs.map((item, i) => {
            return (
              <Card
                href={`/en/datahub/datahubitem-view/${item._source.about}`}
                key={i}
              >
                <Card.Content>
                  <Card.Header>
                    <span title={item._source.label}>
                      {firstWords(item._source.label, 10)}
                    </span>
                  </Card.Header>
                  <Card.Description>
                    <span className="card-description">
                      {item._source.description}
                    </span>
                  </Card.Description>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </div>
    </div>
  ) : null;
};

export default MoreLikeThis;
