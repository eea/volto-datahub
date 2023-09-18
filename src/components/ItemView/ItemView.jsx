import React from 'react';
import { Portal } from 'react-portal';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Container, Icon, Button, Popup } from 'semantic-ui-react';
import { Toolbar } from '@plone/volto/components';
import { BodyClass, asyncConnect, Helmet } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { rebind, applyConfigurationSchema } from '@eeacms/search';
import { Callout, Banner } from '@eeacms/volto-eea-design-system/ui';
import { defineMessages, useIntl } from 'react-intl';
import {
  MoreLikeThis,
  MetadataSection,
  DatasetsView,
} from '@eeacms/volto-datahub/components/ItemView';
import { fetchResult } from '@eeacms/search/lib/hocs/useResult';
import { setDatahubResult } from '@eeacms/volto-datahub/store';

import { viewRouteId } from '@eeacms/volto-datahub/constants';
import { isObsolete } from '@eeacms/volto-datahub/utils';

const appName = 'datahub';
const WORD_COUNT = 60;
const PROD_ID_COUNT = 3;

const splitContent = (content, wordCount) => {
  const words = content.split(' ');
  let firstTextPart = '',
    secondTextPart = '';
  words.forEach((word, idx) => {
    if (idx < wordCount) {
      firstTextPart += ' ' + word;
    } else {
      secondTextPart += ' ' + word;
    }
  });
  return [firstTextPart.trim(), secondTextPart.trim()];
};

function IsomorphicPortal({ children }) {
  const [isClient, setIsClient] = React.useState();
  React.useEffect(() => setIsClient(true), []);

  return isClient ? (
    <Portal node={document.getElementById('page-header')}>{children}</Portal>
  ) : (
    children
  );
}

const messages = defineMessages({
  rssFeed: {
    id: 'rssFeed',
    defaultMessage: 'RSS Feed',
  },
});

function ItemView(props) {
  const { docid, staticContext } = props;
  const dispatch = useDispatch();
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
  const { title, description, raw_value } = item || {};
  const { changeDate, cl_status } = raw_value?.raw || {}; // resourceIdentifier
  const obsolete = isObsolete(cl_status);

  // const prodID = (resourceIdentifier || []).filter((p) => {
  //   return p.code.includes('DAT');
  // })[0]?.code;

  const prodID = Array.isArray(item?.prod_id.raw)
    ? item?.prod_id?.raw
    : item?.prod_id?.raw.split(', ');

  const rawTitle = item && item._meta.found ? title?.raw || '' : docid;

  const splitDescription = description?.raw.split(' ').length > WORD_COUNT;
  const [firstTextPart, secondTextPart] = splitContent(
    description?.raw,
    WORD_COUNT,
  );
  const [isReadMore, setIsReadMore] = React.useState(false);
  const currentUrl = `/en/datahub/${viewRouteId}/${docid}`;

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
                '@id': currentUrl,
              },
            ],
          },
        };
        await dispatch({ type: 'GET_BREADCRUMBS_PENDING' }); // satisfy content load protection
        await dispatch(action);
      }
    };

    handler();
  }, [item, dispatch, docid, rawTitle, currentUrl]);

  const intl = useIntl();
  const rssLinks = [
    {
      title: 'RSS',
      href: `${currentUrl}/datahub_rss.xml`,
    },
  ];

  return item && item._meta.found ? (
    <div className="dataset-view">
      <Helmet title={title?.raw} />
      <IsomorphicPortal>
        <div className="dataset">
          <Banner>
            <Banner.Content
              actions={rssLinks?.map((rssLink, index) => (
                <>
                  <Helmet
                    link={[
                      {
                        rel: 'alternate',
                        title:
                          rssLink.title ?? intl.formatMessage(messages.rssFeed),
                        href: rssLink.href,
                        type:
                          rssLink.feedType === 'atom'
                            ? 'application/atom+xml'
                            : 'application/rss+xml',
                      },
                    ]}
                  />
                  <Banner.Action
                    icon="ri-rss-fill"
                    title={
                      rssLink.title ?? intl.formatMessage(messages.rssFeed)
                    }
                    className="rssfeed"
                    href={rssLink.href}
                    target="_blank"
                  />
                </>
              ))}
            >
              <Banner.Subtitle>
                <Link to={appConfig.landingPageURL}>
                  <Icon className="arrow left" />
                  Datahub overview
                </Link>
              </Banner.Subtitle>
              <Banner.Title>{title?.raw}</Banner.Title>
              {/* <Banner.MetadataField label="Prod-ID" value={prodID} /> */}
              <Banner.Metadata>
                {obsolete && <div class="ui label archived-item">Archived</div>}
                {prodID.length > PROD_ID_COUNT ? (
                  <>
                    <Popup
                      // on="click"
                      position="top right"
                      trigger={
                        <span className="prod-id">
                          <span>
                            <Banner.MetadataField
                              label="Prod-ID"
                              value={prodID.slice(0, PROD_ID_COUNT).join(', ')}
                            />
                          </span>
                          {'...'}
                          <Icon className="ri-add-line" />
                        </span>
                      }
                      content={prodID.slice(PROD_ID_COUNT).join(', ')}
                    />
                    {' | '}
                  </>
                ) : (
                  <Banner.MetadataField
                    label="Prod-ID"
                    value={prodID.join(', ')}
                  />
                )}
                {result.issued && (
                  <Banner.MetadataField
                    label="Published"
                    type="date"
                    value={new Date(result.issued)}
                  />
                )}
                {changeDate && (
                  <Banner.MetadataField
                    label="Last modified"
                    type="date"
                    value={new Date(changeDate)}
                  />
                )}
              </Banner.Metadata>
            </Banner.Content>
          </Banner>
        </div>
      </IsomorphicPortal>

      <div className="dataset-container">
        <Callout>
          {splitDescription ? (
            <p>
              {firstTextPart} {isReadMore ? secondTextPart : ''}
              <Button
                onClick={() => setIsReadMore(!isReadMore)}
                className={`see-more ${isReadMore ? 'open' : 'close'}`}
              >
                {isReadMore ? 'See less' : ' See more'}
              </Button>
            </p>
          ) : (
            <p>{description?.raw}</p>
          )}
        </Callout>
      </div>

      <DatasetsView item={item} appConfig={appConfig} />
      <MetadataSection item={item} appConfig={appConfig} docid={docid} />
      <MoreLikeThis docid={docid} title={title?.raw} appConfig={appConfig} />
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
