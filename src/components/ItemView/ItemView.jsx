import React from 'react';

import { Container } from 'semantic-ui-react';
import { Toolbar } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';
import { Portal } from 'react-portal';
import { useResult } from '@eeacms/search/lib/hocs';
import {
  AppConfigContext,
  SearchContext,
  // useIsMounted,
} from '@eeacms/search/lib/hocs';
import { rebind, applyConfigurationSchema } from '@eeacms/search/lib/utils';
import { SearchProvider, WithSearch } from '@elastic/react-search-ui'; // ErrorBoundary,
import config from '@plone/volto/registry';

const appName = 'datahub';

function ItemView(props) {
  const { docid } = props;
  const result = useResult(null, docid);
  return JSON.stringify(result);
}

function DatahubItemView(props) {

  const [isClient, setIsClient] = React.useState();
  React.useEffect(() => setIsClient(true), []);

  const docid = props.match?.params?.id;
  const registry = config.settings.searchlib;

  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [registry],
  );
  const appConfigContext = React.useMemo(() => ({ appConfig, registry }), [
    appConfig,
    registry,
  ]);

  return (
    <div id="view">
      {/* <ContentMetadataTags content={this.props.content} /> */}
      {/* Body class if displayName in component is set */}
      <BodyClass className="view-datahub-item" />
      <Container className="view-wrapper">
        <h1 className="documentFirstHeading">Datahub item</h1>
        <SearchProvider config={config}>
          <WithSearch
            mapContextToProps={(searchContext) => ({
              ...searchContext,
            })}
          >
            {(params) => {
              // TODO: this needs to be optimized, it causes unmounts
              return (
                <AppConfigContext.Provider value={appConfigContext}>
                  <SearchContext.Provider value={params}>
                    <ItemView docid={docid} />
                  </SearchContext.Provider>
                </AppConfigContext.Provider>
              );
            }}
          </WithSearch>
        </SearchProvider>
      </Container>
      {isClient && (
        <Portal node={document.getElementById('toolbar')}>
          <Toolbar pathname={props.pathname || ''} inner={<span />} />
        </Portal>
      )}
    </div>
  );
}

export default DatahubItemView;
