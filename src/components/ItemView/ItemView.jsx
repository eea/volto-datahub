import React from 'react';
import { Portal } from 'react-portal';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';
import { Toolbar } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import {
  useResult,
  AppConfigContext,
  SearchContext,
  rebind,
  applyConfigurationSchema,
  DateTime,
} from '@eeacms/search';
import { SearchProvider, WithSearch } from '@elastic/react-search-ui';
import { Callout, Banner } from '@eeacms/volto-eea-design-system/ui';
import {
  MoreLikeThis,
  MetadataSection,
  Datasets,
} from '@eeacms/volto-datahub/components/ItemView';
// import bannerBG from './banner.svg';

const appName = 'datahub';

function ItemView(props) {
  const { docid, location, appConfig } = props;
  const { fromPathname, fromSearch } = location?.state || {};
  const dispatch = useDispatch();
  // const content = useSelector((state) => state.content.data);
  const result = useResult(null, docid);
  const item = result ? result._result : null;
  const { title, description, raw_value } = item || {}; // readingTime
  const { changeDate, resourceIdentifier } = raw_value?.raw || {};

  const prodID = (resourceIdentifier || []).filter((p) => {
    return p.code.includes('DAT');
  })[0]?.code;

  const rawTitle = item && item._meta.found ? title?.raw || '' : docid;

  React.useEffect(() => {
    const handler = async () => {
      if (item) {
        const action = {
          type: 'GET_BREADCRUMBS_SUCCESS',
          result: {
            items: [
              {
                title: 'Datahub',
                '@id': '/en/datahub',
              },
              {
                title: rawTitle,
                '@id': `/en/datahub/view/${docid}`,
              },
            ],
          },
        };
        await dispatch({ type: 'GET_BREADCRUMBS_PENDING' }); // satisfy content load protection
        await dispatch(action);
      }
    };

    handler();
  }, [item, dispatch, docid, rawTitle]);

  return item && item._meta.found ? (
    <div className="dataset-view">
      <Portal node={document.getElementById('page-header')}>
        <div className="dataset">
          <Banner>
            <Banner.Content>
              <Banner.Subtitle>
                <Link
                  to={
                    location?.state
                      ? { pathname: fromPathname, search: fromSearch }
                      : {
                          pathname: '/en/datahub/',
                        }
                  }
                >
                  <Icon className="arrow left" />
                  Datahub overview
                </Link>
              </Banner.Subtitle>
              <Banner.Title>{title?.raw}</Banner.Title>
              <Banner.Metadata>
                <Banner.MetadataField label="Prod-ID" value={prodID} />
                <Banner.MetadataField
                  label="Published"
                  type="date"
                  value={<DateTime format="DATE_MED" value={result.issued} />}
                />
                <Banner.MetadataField
                  label="Last modified"
                  type="date"
                  value={<DateTime format="DATE_MED" value={changeDate} />}
                />
                {/* <Banner.MetadataField
                  label="Reading time"
                  value={readingTime?.raw}
                /> */}
              </Banner.Metadata>
            </Banner.Content>
          </Banner>
        </div>
      </Portal>

      <div className="dataset-container">
        <Callout>{description?.raw}</Callout>

        <Datasets item={item} appConfig={appConfig} />

        <MetadataSection item={item} appConfig={appConfig} docid={docid} />

        <MoreLikeThis docid={docid} title={title?.raw} appConfig={appConfig} />
      </div>

      {/* <div className="info-wrapper">
        <div className="info-content">
          <div className="info-title">More Information for {title?.raw}.</div>
          <p>{description?.raw}</p>
        </div>
      </div> */}
    </div>
  ) : item ? (
    <>
      <h1>Data series not found...</h1>
    </>
  ) : (
    <></>
  );
}

function DatahubItemView(props) {
  const location = useLocation();
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
                    <ItemView
                      docid={docid}
                      location={location}
                      appConfig={appConfig}
                    />
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
