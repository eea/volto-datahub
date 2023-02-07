import React from 'react';
import { Portal } from 'react-portal';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';
import { Toolbar } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { rebind, applyConfigurationSchema } from '@eeacms/search';
import { Callout, Banner } from '@eeacms/volto-eea-design-system/ui';
import {
  MoreLikeThis,
  MetadataSection,
  Datasets,
} from '@eeacms/volto-datahub/components/ItemView';

import { asyncConnect, Helmet } from '@plone/volto/helpers';
import { fetchResult } from '@eeacms/search/lib/hocs/useResult';
import { setDatahubResult } from '@eeacms/volto-datahub/store';

const appName = 'datahub';

function IsomorphicPortal({ children }) {
  const [isClient, setIsClient] = React.useState();
  React.useEffect(() => setIsClient(true), []);

  return isClient ? (
    <Portal node={document.getElementById('page-header')}>{children}</Portal>
  ) : (
    children
  );
}

function ItemView(props) {
  const { docid, location, staticContext } = props;
  const { fromPathname, fromSearch } = location?.state || {};
  const dispatch = useDispatch();
  // const content = useSelector((state) => state.content.data);
  let result = useSelector((state) => state.datahub_results?.[docid]);
  if (__SERVER__ && !result?._original?.found) {
    staticContext.error_code = 404;
    staticContext.error = 'NotFound';
  }
  const registry = config.settings.searchlib;
  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [registry.searchui],
  );

  React.useEffect(() => {
    let ignore = false;

    const doIt = async () => {
      const result = await fetchResult(docid, appConfig, registry);
      dispatch(setDatahubResult(docid, result));
    };

    if (!ignore && !result) {
      doIt();
    }
    return () => {
      ignore = true;
    };
  }, [result, docid, appConfig, registry, dispatch]);

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
      <Helmet title={title?.raw} />
      <IsomorphicPortal>
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
                  value={new Date(result.issued)}
                />
                <Banner.MetadataField
                  label="Last modified"
                  type="date"
                  value={new Date(changeDate)}
                />
                {/* <Banner.MetadataField
                  label="Reading time"
                  value={readingTime?.raw}
                /> */}
              </Banner.Metadata>
            </Banner.Content>
          </Banner>
        </div>
      </IsomorphicPortal>

      <div className="dataset-container">
        <Callout>{description?.raw}</Callout>
      </div>

      <div className="dataset-container">
        <h2>Datasets</h2>
      </div>

      <Datasets item={item} appConfig={appConfig} />

      <MetadataSection item={item} appConfig={appConfig} docid={docid} />

      <MoreLikeThis docid={docid} title={title?.raw} appConfig={appConfig} />

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
  const { staticContext = {} } = props;

  return (
    <div id="view">
      {/* <ContentMetadataTags content={this.props.content} /> */}
      {/* Body class if displayName in component is set */}
      <BodyClass className="view-datahub-item" />
      <Container className="view-wrapper">
        <ItemView
          docid={docid}
          location={location}
          staticContext={staticContext}
        />
      </Container>
      {isClient && (
        <Portal node={document.getElementById('toolbar')}>
          <Toolbar pathname={props.pathname || ''} inner={<span />} />
        </Portal>
      )}
    </div>
  );
}
export default asyncConnect([
  {
    key: 'datahubItem',
    promise: function datahubItem({
      location,
      store,
      match: {
        params: { id },
      },
    }) {
      const registry = config.settings.searchlib;
      const appConfig = applyConfigurationSchema(
        rebind(registry.searchui[appName]),
      );
      return fetchResult(id, appConfig, registry).then((result) => {
        store.dispatch(setDatahubResult(id, result));
      });
    },
  },
])(DatahubItemView);
