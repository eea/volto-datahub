import React from 'react';
import { Container, Accordion, Icon, List } from 'semantic-ui-react';
import { Toolbar } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';
import { Portal } from 'react-portal';
import {
  useResult,
  AppConfigContext,
  SearchContext,
  rebind,
  applyConfigurationSchema,
} from '@eeacms/search';
import { DateTime } from '@eeacms/search';
import { SearchProvider, WithSearch } from '@elastic/react-search-ui';
import { Callout, Banner } from '@eeacms/volto-eea-design-system/ui';
import { useDispatch } from 'react-redux';
import config from '@plone/volto/registry';
import { Link, useLocation } from 'react-router-dom';
import bannerBG from './banner.svg';

const appName = 'datahub';

function ItemView(props) {
  const { docid, location } = props;
  const { fromPathname, fromSearch } = location?.state || {};
  const dispatch = useDispatch();
  // const content = useSelector((state) => state.content.data);
  const result = useResult(null, docid);
  const item = result ? result._result : null;
  const { title, description, raw_value, issued, time_coverage } = item || {}; // readingTime
  const { changeDate, children } = raw_value?.raw || {};
  const startTempCoverage = time_coverage?.raw.at(0);
  const endTempCoverage = time_coverage?.raw.at(-1);
  const rawTitle = title?.raw || '';

  const [activeIndex, setActiveIndex] = React.useState(null);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  }

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

  // console.log('result', result?._result);

  return item ? (
    <div className="dataset-view">
      <Portal node={document.getElementById('page-header')}>
        <div className="dataset">
          <Banner image_url={bannerBG} image>
            <Banner.Content>
              <Banner.Title>Datahub</Banner.Title>
            </Banner.Content>
          </Banner>
        </div>
      </Portal>

      <div className="dataset-container">
        <Link
          className="search-link"
          to={
            location?.state
              ? { pathname: fromPathname, search: fromSearch }
              : {
                  pathname: '/en/datahub/',
                }
          }
        >
          <Icon className="ri-arrow-go-back-line" />
          Back to search
        </Link>

        <div className="dataset-header">
          <h1>{title?.raw}</h1>
          <div className="dataset-header-bottom">
            <span className="header-data">Prod-ID: [No data]</span>
            <span className="header-data">
              Created: <DateTime format="DATE_MED" value={issued?.raw} />
            </span>
            <span className="header-data">Published: [No data]</span>
            <span className="header-data">
              Last modified: <DateTime format="DATE_MED" value={changeDate} />
            </span>
            {/*<span className="header-data">
                Reading time: {readingTime?.raw}
              </span>*/}
          </div>
        </div>

        <Callout>{description?.raw}</Callout>

        {children && children.length > 0 && (
          <>
            <h2>Data</h2>
            <Accordion>
              {children.map((dataset, index) => {
                return (
                  <>
                    {dataset.link && dataset.link.length > 0 ? (
                      <>
                        <Accordion.Title
                          active={activeIndex === index}
                          index={index}
                          onClick={handleClick}
                        >
                          {dataset.resourceTitleObject.default}
                          <Icon className="ri-arrow-down-s-line" />
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                          <List divided relaxed>
                            {(dataset.link || [])
                              .filter((i) => i.protocol === 'WWW:URL')
                              .map((item, i) => {
                                return (
                                  <List.Item>
                                    <List.Content>
                                      <div className="dataset-item">
                                        <span>{item.name}</span>

                                        <a href={item.url}>
                                          <Icon className="download" /> Download
                                          link
                                        </a>
                                      </div>
                                    </List.Content>
                                  </List.Item>
                                );
                              })}
                          </List>

                          <List divided relaxed>
                            {(dataset.link || [])
                              .filter(
                                (i) =>
                                  i.protocol === 'EEA:FILEPATH' ||
                                  i.protocol === 'WWW:LINK',
                              )
                              .map((item, i) => {
                                return (
                                  <List.Item>
                                    <List.Content>
                                      <div className="dataset-item">
                                        {item.name ? (
                                          <span>
                                            <Icon className="file outline" />{' '}
                                            {item.name}
                                          </span>
                                        ) : (
                                          <span>[no name]</span>
                                        )}

                                        <a href={item.url}>
                                          <Icon className="download" /> Download
                                          link
                                        </a>
                                      </div>
                                    </List.Content>
                                  </List.Item>
                                );
                              })}
                          </List>

                          <List divided relaxed>
                            {(dataset.link || [])
                              .filter((i) => i.protocol === 'ESRI:REST')
                              .map((item, i) => {
                                return (
                                  <List.Item>
                                    <List.Content>
                                      <Icon className="globe" />{' '}
                                      <span>{item.protocol}: </span>
                                      <a href={item.url}>
                                        {item.name || item.url}
                                      </a>
                                    </List.Content>
                                  </List.Item>
                                );
                              })}
                          </List>

                          <List divided relaxed>
                            {(dataset.link || [])
                              .filter((i) => i.protocol === 'OGC:WMS')
                              .map((item, i) => {
                                return (
                                  <List.Item>
                                    <List.Content>
                                      <Icon className="globe" />{' '}
                                      <span>{item.protocol}: </span>
                                      <a href={item.url}>
                                        {item.description || item.url}
                                      </a>
                                    </List.Content>
                                  </List.Item>
                                );
                              })}
                          </List>
                        </Accordion.Content>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                );
              })}
            </Accordion>
          </>
        )}
      </div>

      <div className="info-wrapper">
        <div className="info-content">
          <div className="info-title">More Information for {title?.raw}.</div>
          <p>{description?.raw}</p>
        </div>
      </div>

      <div className="dataset-container">
        <h2>More information</h2>
        {!!item?.rod && (
          <div>
            <h5>Reporting obligations (ROD)</h5>
            <ul>
              {Array.isArray(item.rod?.raw) ? (
                <>
                  {item?.rod?.raw.map((item, i) => {
                    return <li key={i}>{item}</li>;
                  })}
                </>
              ) : (
                <li>{item.rod?.raw}</li>
              )}
            </ul>
          </div>
        )}
        {!!item?.organisation && (
          <div>
            <h5>Organisation</h5>
            <ul>
              {Array.isArray(item?.organisation?.raw) ? (
                <>
                  {item?.organisation?.raw.map((item, i) => {
                    return <li key={i}>{item}</li>;
                  })}
                </>
              ) : (
                <li>{item?.organisation?.raw}</li>
              )}
            </ul>
          </div>
        )}
        {time_coverage?.raw && time_coverage?.raw.length > 0 && (
          <>
            <h5>Temporal coverage</h5>
            {Array.isArray(time_coverage?.raw) ? (
              <span>
                {startTempCoverage} - {endTempCoverage}
              </span>
            ) : (
              <span>{time_coverage?.raw}</span>
            )}
          </>
        )}
      </div>
    </div>
  ) : null;
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
                    <ItemView docid={docid} location={location} />
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
