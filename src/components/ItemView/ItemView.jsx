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
import servicesSVG from './icons/services.svg';

import MoreLikeThis from './MoreLikeThis';

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
  const { docid, location, appConfig } = props;
  const { fromPathname, fromSearch } = location?.state || {};
  const dispatch = useDispatch();
  // const content = useSelector((state) => state.content.data);
  const result = useResult(null, docid);
  const item = result ? result._result : null;
  const { title, description, raw_value, issued } = item || {}; // readingTime
  const { changeDate, children, merged_time_coverage_range } =
    raw_value?.raw || {};
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
  // console.log('children', children);
  if (item?.organisation) {
    if (!Array.isArray(item?.organisation?.raw)) {
      item.organisation.raw = [item.organisation.raw];
    }
    item.organisation.raw = item.organisation.raw.filter(
      (org) => org !== 'European Environment Agency',
    );
  }

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
                        {dataset.resourceTitleObject.default}
                        <span className="formats">
                          {(dataset.format || []).map((item, i) => {
                            return <span className="format-label">{item}</span>;
                          })}
                        </span>
                      </span>
                      <Icon className="ri-arrow-down-s-line" />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === index}>
                      <div className="dataset-content">
                        {resourceTemporalExtentDetails &&
                          resourceTemporalExtentDetails?.length > 0 && (
                            <div>
                              <strong>Temporal coverage: </strong>

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
                                  <>
                                    <span>
                                      {tc_start === tc_end && tc_start}
                                      {tc_start !== tc_end &&
                                        tc_start + ' - ' + tc_end}
                                    </span>
                                    {i !==
                                    resourceTemporalExtentDetails.length - 1
                                      ? ', '
                                      : ' '}
                                  </>
                                );
                              })}
                            </div>
                          )}
                        {dataset.resourceType[0] !== 'nonGeographicDataset' && (
                          <div className="dataset-pdf">
                            <div className="pdf-btn">
                              <Icon className="file pdf" />
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={`${appConfig.indexBaseUrl}/catalogue/datahub/api/records/${dataset.metadataIdentifier}/formatters/xsl-view?output=pdf&language=eng&approved=true`}
                              >
                                PDF Factsheet
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

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
                                    <SVGIcon name={servicesSVG} size="18" />
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

        <div className="metadata-wrapper">
          {(item?.rod ||
            item?.organisation ||
            merged_time_coverage_range?.length > 0) && (
            <h2>SDI Metadata Catalogue</h2>
          )}
          {!!item?.rod && (
            <div className="metadata-section">
              <h5>Reporting obligations (ROD)</h5>

              {Array.isArray(item.rod?.raw) ? (
                <>
                  {item?.rod?.raw.map((item, i) => {
                    return <div key={i}>{item}</div>;
                  })}
                </>
              ) : (
                <div>{item.rod?.raw}</div>
              )}
            </div>
          )}
          {!!item?.organisation && item?.organisation.raw.length > 0 && (
            <div className="metadata-section">
              <h5>Organisation:</h5>
              {Array.isArray(item?.organisation?.raw) ? (
                <>
                  {item?.organisation?.raw.map((item, i) => {
                    return <div key={i}>{item}</div>;
                  })}
                </>
              ) : (
                <div>{item?.organisation?.raw}</div>
              )}
            </div>
          )}
          {merged_time_coverage_range &&
            merged_time_coverage_range?.length > 0 && (
              <div className="metadata-section">
                <h5>Temporal coverage:</h5>

                {merged_time_coverage_range.map((tc, i) => {
                  const tc_start = tc.start || '';
                  const tc_end = tc.end || '';
                  return (
                    <>
                      <span>
                        {tc_start === tc_end && tc_start}
                        {tc_start !== tc_end && tc_start + ' - ' + tc_end}
                      </span>
                      {i !== merged_time_coverage_range.length - 1 ? ', ' : ' '}
                    </>
                  );
                })}
              </div>
            )}

          <div className="pdf-btn">
            <Icon className="file pdf" />
            <a
              target="_blank"
              rel="noreferrer"
              href={`${appConfig.indexBaseUrl}/catalogue/datahub/api/records/${docid}/formatters/xsl-view?output=pdf&language=eng&approved=true`}
            >
              PDF Factsheet
            </a>
          </div>
        </div>
        <MoreLikeThis
          docid={docid}
          title={title.raw}
          appConfig={appConfig}
        ></MoreLikeThis>
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
