import installDatahub from './config';
import DatahubCardItem from './components/Result/DatahubCardItem';
import DatahubItemView from './components/ItemView/ItemView';
import { DatahubResultModel } from './config/models';
import { datahub_results } from './store';
import { viewRouteId, rssRouteId } from '@eeacms/volto-datahub/constants';

function tweakForNLPService(body, config) {
  if (!config.enableNLP) {
    delete body.source;
    delete body.index;
    return body;
  }
  return body;
}

const applyConfig = (config) => {
  config.settings.searchlib = installDatahub(config.settings.searchlib);

  const {
    resolve,
    searchui: { datahub },
  } = config.settings.searchlib;

  resolve.DatahubCardItem = { component: DatahubCardItem };
  resolve.DatahubResultModel = DatahubResultModel;

  // Tweak the searchlib config to use the middleware instead of the index
  datahub.elastic_index = '_es/datahub';
  datahub.index_name = 'data_searchui_datahub';
  datahub.enableNLP = true;
  datahub.showPromptQueries = false;
  datahub.requestBodyModifiers.push(tweakForNLPService);
  datahub.indexBaseUrl = 'https://sdi.eea.europa.eu';
  datahub.landingPageURL = '/en/datahub';
  // datahub.resultViews[0].factories.item = "DatahubListingViewItem"
  datahub.resultItemModel.factory = 'DatahubResultModel';

  config.settings.nonContentRoutes.push(new RegExp(`${viewRouteId}\\/(.*)`));
  const rssRouteIdRegexp = rssRouteId.replace('.', '\\.');
  config.settings.nonContentRoutes.push(
    new RegExp(`/.+/datahub/${rssRouteIdRegexp}`),
  );

  config.settings.externalRoutes.push({
    match: {
      path: new RegExp(`/.+/${rssRouteIdRegexp}`),
      strict: true,
      exact: true,
    },
  });
  config.addonRoutes = [
    {
      path: `*/${viewRouteId}/:id`,
      component: DatahubItemView,
    },

    ...(config.addonRoutes || []),
  ];
  config.addonReducers.datahub_results = datahub_results;

  if (__SERVER__) {
    const makeMiddlewares = require('./express-middleware').default;

    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      makeMiddlewares(config),
    ];
  }

  return config;
};

export default applyConfig;
