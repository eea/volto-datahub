import React from 'react';
import { Container, Accordion, Icon, List } from 'semantic-ui-react';
import { Toolbar } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';
import { Portal } from 'react-portal';
import {
//  useAppConfig,
  useResult,
  AppConfigContext,
  SearchContext,
  rebind,
  applyConfigurationSchema,
} from '@eeacms/search';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { DateTime } from '@eeacms/search';
import { SearchProvider, WithSearch } from '@elastic/react-search-ui';
import { Callout, Banner } from '@eeacms/volto-eea-design-system/ui';
import { useDispatch } from 'react-redux';
import config from '@plone/volto/registry';
import { Link, useLocation } from 'react-router-dom';
import bannerBG from './banner.svg';
import servicesSVG from './icons/services.svg';

const appName = 'datahub';

const SVGIcon = ({ name, size, color, className, title, onClick }) => {
  return (
    <svg
      xmlns={name.attributes && name.attributes.xmlns}
      viewBox={name.attributes && name.attributes.viewBox}
      style={{ height: size, width: 'auto', fill: color || 'currentColor' }}
      className={className ? `icon ${className}` : 'icon'}
      onClick={onClick}
      dangerouslySetInnerHTML={{
        __html: title ? `<title>${title}</title>${name.content}` : name.content,
      }}
    />
  );
};

function ItemView(props) {
  const { docid, location } = props;
  const { fromPathname, fromSearch } = location?.state || {};
  const dispatch = useDispatch();
  // const content = useSelector((state) => state.content.data);
  const result = useResult(null, docid);
  const item = result ? result._result : null;
  const { title, description, raw_value, issued } = item || {}; // readingTime
  const { changeDate, children, merged_time_coverage_range } =
    raw_value?.raw || {};
  // const startTempCoverage = time_coverage?.raw.at(0);
  // const endTempCoverage = time_coverage?.raw.at(-1);
  const rawTitle = title?.raw || '';
  const [activeIndex, setActiveIndex] = React.useState(0);

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

  const datasets = React.useMemo(
    () =>
      (children || []).sort(
        (a, b) =>
          new Date(b.publicationDateForResource).getTime() -
          new Date(a.publicationDateForResource).getTime(),
      ),
    [children],
  );

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

        {datasets && datasets.length > 0 && (
          <>
            <h2>Data</h2>
            <Accordion>
              {datasets.map((dataset, index) => {
                const { resourceTemporalExtentDetails } = dataset;
                return (
                  <>
                    <Accordion.Title
                      active={activeIndex === index}
                      index={index}
                      onClick={handleClick}
                    >
                      <span className="dataset-title">
                        <div>{dataset.resourceTitleObject.default}</div>
                        <span>
                          {(dataset.format || []).map((item, i) => {
                            return <span className="format-label">{item}</span>;
                          })}
                        </span>
                      </span>
                      <Icon className="ri-arrow-down-s-line" />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === index}>
                      {resourceTemporalExtentDetails &&
                        resourceTemporalExtentDetails?.length > 0 && (
                          <>
                            <h5>Temporal coverage</h5>
                            <ul>
                              {resourceTemporalExtentDetails.map((tc, i) => {
                                let tc_start = tc?.start?.date;
                                if (tc_start) {
                                  tc_start = new Date(
                                    Date.parse(tc_start),
                                  ).getFullYear();
                                }
                                let tc_end = tc?.end?.date;
                                if (tc_end) {
                                  tc_end = new Date(
                                    Date.parse(tc_end),
                                  ).getFullYear();
                                }
                                tc_start = tc_start || '';
                                tc_end = tc_end || '';
                                return (
                                  <li>
                                    {tc_start === tc_end && tc_start}
                                    {tc_start !== tc_end &&
                                      tc_start + ' - ' + tc_end}
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      {!!dataset.link && dataset.link.length > 0 ? (
                        <List divided relaxed>
                          {dataset.link
                            .filter((i) => i.protocol === 'WWW:URL')
                            .map((item, i) => {
                              return (
                                <List.Item>
                                  <List.Content>
                                    <div className="dataset-item">
                                      <Icon className="download" />
                                      <a href={item.url} className="item-link">
                                        <span>{item.name}</span>
                                      </a>
                                    </div>
                                  </List.Content>
                                  {item.description && (
                                    <span
                                      className="item-description"
                                      title={item.description}
                                    >
                                      {item.description}
                                    </span>
                                  )}
                                </List.Item>
                              );
                            })}

                          {dataset.link
                            .filter((i) => i.protocol === 'WWW:LINK')
                            .map((item, i) => {
                              return (
                                <List.Item>
                                  <List.Content>
                                    <div className="dataset-item">
                                      <Icon className="download" />
                                      {item.name ? (
                                        <a
                                          href={item.url}
                                          className="item-link"
                                        >
                                          {item.name}
                                        </a>
                                      ) : (
                                        <a
                                          href={item.url}
                                          className="item-link"
                                        >
                                          Download link
                                        </a>
                                      )}
                                    </div>
                                  </List.Content>
                                </List.Item>
                              );
                            })}

                          {dataset.link
                            .filter(
                              (i) =>
                                i.protocol === 'EEA:FILEPATH' ||
                                i.protocol === 'EEA:FOLDERPATH',
                            )
                            .map((item, i) => {
                              return (
                                <List.Item>
                                  <List.Content>
                                    <div className="dataset-item">
                                      <Icon className="download" />
                                      <a href={item.url} className="item-link">
                                        WebDAV: {item.name || item.function}
                                      </a>
                                    </div>
                                  </List.Content>
                                </List.Item>
                              );
                            })}

                          {dataset.link
                            .filter(
                              (i) =>
                                i.protocol === 'ESRI:REST' ||
                                i.protocol === 'OGC:WMS',
                            )
                            .map((item, i) => {
                              return (
                                <List.Item>
                                  <List.Content>
                                    <SVGIcon name={servicesSVG} size="19" />{' '}
                                    {(item.name || item.description) && (
                                      <span className="item-protocol">
                                        {item.protocol}:
                                      </span>
                                    )}
                                    <a className="item-link" href={item.url}>
                                      {item.name ||
                                        item.description ||
                                        item.protocol}
                                    </a>
                                  </List.Content>
                                </List.Item>
                              );
                            })}

                          {dataset.link
                            .filter((i) => i.protocol.includes('WWW:LINK'))
                            .map((item, i) => {
                              return (
                                <List.Item>
                                  <List.Content>
                                    <div className="dataset-item">
                                      <Icon className="linkify" />
                                      <a href={item.url} className="item-link">
                                        <span>{item.name || item.url}</span>
                                      </a>
                                    </div>
                                  </List.Content>
                                  {item.description && (
                                    <span className="item-description">
                                      {item.description}
                                    </span>
                                  )}
                                </List.Item>
                              );
                            })}

                          {dataset.resourceType[0] !==
                            'nonGeographicDataset' && (
                            <List.Item>
                              <List.Content>
                                <div className="dataset-item">
                                  <Icon className="file pdf" />
                                  <a
                                    className="item-link"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://sdi.eea.europa.eu/catalogue/srv/api/records/${dataset.metadataIdentifier}/formatters/xsl-view?output=pdf&language=eng&approved=true`}
                                  >
                                    PDF Factsheet
                                  </a>
                                </div>
                              </List.Content>
                            </List.Item>
                          )}
                        </List>
                      ) : (
                        ''
                      )}
                    </Accordion.Content>
                  </>
                );
              })}
            </Accordion>
          </>
        )}

        {(item?.rod ||
          item?.organisation ||
          merged_time_coverage_range?.length > 0) && (
          <h2>SDI Metadata Catalogue</h2>
        )}
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
        {merged_time_coverage_range && merged_time_coverage_range?.length > 0 && (
          <>
            <h5>Temporal coverage</h5>
            <ul>
              {merged_time_coverage_range.map((tc, i) => {
                const tc_start = tc.start || '';
                const tc_end = tc.end || '';
                return (
                  <li>
                    {tc_start === tc_end && tc_start}
                    {tc_start !== tc_end && tc_start + ' - ' + tc_end}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      {/* <div className="info-wrapper">
        <div className="info-content">
          <div className="info-title">More Information for {title?.raw}.</div>
          <p>{description?.raw}</p>
        </div>
      </div> */}
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
