import { mergeConfig } from '@eeacms/search';
import facets from './facets';
import views from './views';
import filters from './filters';
import vocabs from './vocabulary';

import DatahubLandingPage from '../components/LandingPage/DatahubLandingPage';

const datahubConfig = {
  title: 'Datahub',

  ...facets,
  ...views,
  ...filters,
  ...vocabs,

  sourceExcludedFields: ['nlp_*', 'event', 'raw_value'], // don't need these in results
};

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

export default function install(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : datahubConfig;

  const pjson = require('../../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.datahub = {
    ...mergeConfig(envConfig, config.searchui.globalsearch),
    elastic_index: 'es',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
  };

  config.searchui.datahub.facets = envConfig.facets;

  config.resolve['DatahubLandingPage'] = {
    component: DatahubLandingPage,
  };

  if (typeof window !== 'undefined') {
    config.searchui.datahub.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
