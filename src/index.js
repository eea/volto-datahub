import installDatahub from './config';
import DatahubCardItem from './components/Result/DatahubCardItem';
import DatahubItemView from './components/ItemView/ItemView';

function tweakForNLPService(body, config) {
  if (!config.enableNLP) {
    body._source = { ...body.source };
    delete body.source;
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

  config.settings.searchlib.searchui.datahub.requestBodyModifiers.push(
    tweakForNLPService,
  );

  resolve.DatahubCardItem = { component: DatahubCardItem };

  // Tweak the searchlib config to use the middleware instead of the index
  datahub.elastic_index = '_es/globalsearch';
  datahub.index_name = 'data_searchui_datahub';
  datahub.enableNLP = false;
  // datahub.resultViews[0].factories.item = "DatahubListingViewItem"

  config.settings.nonContentRoutes.push(/\/datahub\/view\/(.*)/);
  config.addonRoutes = [
    {
      path: '/datahub/view/:id',
      component: DatahubItemView,
    },

    ...(config.addonRoutes || []),
  ];
  return config;
};

export default applyConfig;
