import { registry } from '@eeacms/search';
import express from 'express';
import buildRequest from '@eeacms/search/lib/search/query';
import superagent from 'superagent';
// import zlib from 'zlib';

const getUrlES = (appName) => {
  return (
    process.env[`RAZZLE_PROXY_ES_DSN_${appName}`] ||
    process.env.RAZZLE_PROXY_ES_DSN ||
    'http://localhost:9200/_all'
  );
};

function handleSearchRequest(body, params) {
  const { urlES } = params;
  const url = `${urlES}/_search?filter_path=hits.hits._id&size=10000`;
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
        return reject({ error: 'Error' });
      });
  });
}

function toPublicURL(id) {
  return `https://www.eea.europa.eu/en/datahub/datahubitem-view/${id}`;
}

function generateSitemap(appConfig) {
  return new Promise((resolve, reject) => {
    const body = buildRequest({ filters: [] }, appConfig);
    delete body.source;
    delete body['params'];
    delete body['runtime_mappings'];
    delete body['index'];
    const urlES = getUrlES('datahub');
    handleSearchRequest(body, { urlES }).then((body) => {
      const items = body?.hits?.hits || [];

      const urls = items.map(
        (item) => `  <url>\n    <loc>${toPublicURL(item._id)}</loc>\n
          <lastmod>${item.modified}</lastmod>\n  </url>`,
      );
      const result = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n${urls.join(
        '\n',
      )}\n</urlset>`;

      // zlib.gzip(Buffer.from(result, 'utf8'), (_err, buffer) => {
      //   resolve(buffer);
      // });

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

export default function makeMiddlewares(config) {
  const middleware = express.Router();
  // middleware.use(express.json({ limit: config.settings.maxResponseSize }));
  middleware.use(express.urlencoded({ extended: true }));

  middleware.all('**/datahub/sitemap-data.xml', sitemap);
  middleware.id = 'datahub-sitemap';

  return middleware;
}
