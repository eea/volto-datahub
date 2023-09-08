import { registry } from '@eeacms/search';
import express from 'express';
import superagent from 'superagent';
import { Feed } from 'feed';

import buildRequest from '@eeacms/search/lib/search/query';
import { fetchResult } from '@eeacms/search/lib/hocs/useResult';

import {
  rssRouteId,
  viewRouteId,
  redirectRouteId,
} from '@eeacms/volto-datahub/constants';

const getUrlES = (appName) => {
  return (
    process.env[`RAZZLE_PROXY_ES_DSN_${appName}`] ||
    process.env.RAZZLE_PROXY_ES_DSN ||
    'http://localhost:9200/_all'
  );
};

function handleSearchRequest(body, params) {
  const { urlES } = params;
  const url = `${urlES}/_search`;
  if (body?.params?.config) {
    delete body.params.config;
  }

  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .send(body)
      .set('accept', 'application/json')
      .end((err, resp) => {
        if (resp && resp.body) {
          return resolve(resp.body);
        }
        return reject(err);
      });
  });
}

function generateSitemap(appConfig) {
  const toPublicURL = (id) => {
    return `https://eea.europa.eu/en/datahub/${viewRouteId}/${id}`;
  };

  return new Promise((resolve, reject) => {
    const body = buildRequest({ filters: [] }, appConfig);
    delete body['source'];
    delete body['params'];
    delete body['runtime_mappings'];
    delete body['index'];
    body._source = { include: ['about', 'last_modified'] };
    body.size = 10000;
    const urlES = getUrlES('datahub');
    handleSearchRequest(body, { urlES }).then((body) => {
      const items = body?.hits?.hits || [];

      const urls = items.map(
        (item) => `  <url>\n    <loc>${toPublicURL(item._id)}</loc>\n
          <lastmod>${item._source.last_modified}</lastmod>\n  </url>`,
      );
      const result = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n${urls.join(
        '\n',
      )}\n</urlset>`;

      resolve(result);
    });
  });
}

function sitemap(req, res, next) {
  const appConfig = registry.searchui['datahub'];

  generateSitemap(appConfig)
    .then((body) => res.send(body))
    .catch((body) => {
      res.send({ error: body });
    });
}

function datasetRedirect(req, res, next) {
  const prod_id = req.params['id'];

  if (!prod_id) return next();

  // example of id: DAT-238-en

  const body = {
    query: {
      bool: {
        must: [
          {
            match: {
              prod_id,
            },
          },
        ],
      },
    },
  };

  const urlES = getUrlES('datahub');

  handleSearchRequest(body, { urlES }).then((result) => {
    const total = result.hits.total.value;
    if (!total) return next();

    const hit = result.hits.hits[0];
    const { _id } = hit;
    res.redirect(301, `/en/datahub/datahubitem-view/${_id}`);
  });
}

function generateRSS({ appConfig, feedUrl, toPublicURL }) {
  return new Promise((resolve, reject) => {
    const body = buildRequest({ filters: [] }, appConfig);
    delete body['source'];
    delete body['params'];
    delete body['runtime_mappings'];
    delete body['index'];
    body._source = {
      include: ['about', 'last_modified', 'title', 'description'],
    };
    body.size = 10000;
    const urlES = getUrlES('datahub');

    handleSearchRequest(body, { urlES })
      .then((body) => {
        const items = body?.hits?.hits || [];

        const feed = new Feed({
          title: 'EEA Datahub',
          description: 'Latest changes in EEA Datahub',
          id: 'https://eea.europa.eu/en/datahub',
          generator: 'EEA Website',
          link: 'https://eea.europa.eu/en/datahub',
          feedLinks: {
            rss: feedUrl,
          },
        });

        items.forEach((item) => {
          feed.addItem({
            id: toPublicURL(item._id),
            title: item._source.title,
            description: item._source.description,
            date: new Date(item._source.last_modified),
          });
        });

        const result = feed.rss2(); // TODO: make this pluggable

        resolve(result);
      })
      .catch(reject);
  });
}

function generateItemRSS({ appConfig, feedUrl, toPublicURL, params }) {
  return new Promise((resolve, reject) => {
    const docid = params['id'];

    fetchResult(docid, appConfig, registry)
      .then((body) => {
        const result = body._result;
        const url = toPublicURL(docid);
        const title = result.title.raw;
        const feed = new Feed({
          title,
          description: `Latest changes in ${title}`,
          id: url,
          generator: 'EEA Website',
          link: url,
          feedLinks: {
            rss: feedUrl,
          },
        });
        const items = result['raw_value']['raw']['children'];

        items.forEach((item) => {
          const date = item.publicationDateForResource?.[0];
          feed.addItem({
            id: `${docid}/${item.id}`,
            title: item.resourceTitleObject.default,
            link: `${url}?activeAccordion=${item.id}`,
            ...(date ? { date: new Date(date) } : {}),
          });
        });

        resolve(feed.rss2());
      })
      .catch(reject);
  });
}

function make_rssMiddleware(config, generator) {
  function rssMiddleware(req, res, next) {
    const appConfig = registry.searchui['datahub'];
    const feedUrl = `${config.settings.apiPath}${req.path}`;

    const toPublicURL = (id) =>
      `${config.settings.apiPath}/en/datahub/${viewRouteId}/${id}`;

    generator({ appConfig, feedUrl, toPublicURL, params: req.params })
      .then((body) => {
        res.setHeader('content-type', 'application/rss+xml');
        res.send(body);
      })
      .catch((body) => {
        res.send({ error: body });
      });
  }
  return rssMiddleware;
}

export default function makeMiddlewares(config) {
  const middleware = express.Router();
  // middleware.use(express.json({ limit: config.settings.maxResponseSize }));
  middleware.use(express.urlencoded({ extended: true }));

  middleware.all('**/datahub/sitemap-data.xml', sitemap);
  middleware.all(
    '**/datahub/datahub_rss.xml',
    make_rssMiddleware(config, generateRSS),
  );
  middleware.all(
    `**/datahub/${viewRouteId}/:id/${rssRouteId}`,
    make_rssMiddleware(config, generateItemRSS),
  );
  middleware.all(`**/datahub/${redirectRouteId}/:id`, datasetRedirect);
  middleware.id = 'datahub-middlewares';

  return middleware;
}
