import installDatahub from './config';

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

  const { datahub } = config.settings.searchlib.searchui;

  config.settings.searchlib.searchui.datahub.requestBodyModifiers.push(
    tweakForNLPService,
  );

  // Tweak the searchlib config to use the middleware instead of the index
  datahub.elastic_index = '_es/globalsearch';
  datahub.enableNLP = false;

  return config;
};

export default applyConfig;
