import installDatahub from './config';

const applyConfig = (config) => {
  config.settings.searchlib = installDatahub(config.settings.searchlib);

  const { datahub } = config.settings.searchlib.searchui;

  // Tweak the searchlib config to use the middleware instead of the index
  datahub.elastic_index = '_es/globalsearch';

  return config;
};

export default applyConfig;
