import React from 'react';
import {
  Container,
  Card,
  Image,
  Accordion,
  Icon,
  Tab,
} from 'semantic-ui-react';
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
import TemporalCoverage from './TemporalCoverage';
import bannerBG from './banner.svg';

const appName = 'datahub';

function ItemView(props) {
  const { docid, location } = props;
  const { fromPathname, fromSearch } = location?.state || {};
  const dispatch = useDispatch();
  // const content = useSelector((state) => state.content.data);
  const result = useResult(null, docid);
  const item = result ? result._result : null;
  const { title, description, raw_value, event, issued, time_coverage } =
    item || {}; // readingTime
  const rawTitle = title?.raw || '';

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

  const {
    // contactForResource,
    // contact,
    // resourceTemporalDateRange,
    changeDate,
  } = raw_value?.raw || {};
  const relatedItemsData = event?.raw.original;
  const relatedDatasets =
    (relatedItemsData && JSON.parse(relatedItemsData)) || {};
  const { children } = relatedDatasets?.raw_value || {};

  const [activeIndex, setActiveIndex] = React.useState([]);

  const toggleOpenAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex =
      activeIndex.indexOf(index) === -1
        ? [...activeIndex, index]
        : activeIndex.filter((item) => item !== index);

    setActiveIndex(newIndex);
  };
  // console.log('result', result?._result);

  const panes = [
    {
      menuItem: 'European data',
      render: () => <Tab.Pane attached={false}>Tab 1 Content</Tab.Pane>,
    },
    {
      menuItem: 'Dataset definition',
      render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
    },
  ];

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
        {location?.state ? (
          <Link
            className="search-link"
            to={{
              pathname: fromPathname,
              search: fromSearch,
            }}
          >
            <i class="ri-arrow-go-back-line"></i>
            Back to search
          </Link>
        ) : (
          <Link
            className="search-link"
            to={{
              pathname: '/en/datahub/',
            }}
          >
            <i class="ri-arrow-go-back-line"></i>
            Back to search
          </Link>
        )}
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

        <Tab
          menu={{ secondary: true, pointing: true }}
          panes={panes}
          className="dataset-tab-setion"
        />
      </div>

      <div className="info-wrapper">
        <div className="info-content">
          <div className="info-title">More Information for {title?.raw}.</div>
          <p>{description?.raw}</p>
        </div>
      </div>

      {children && children.length > 0 && (
        <div className="related-wrapper">
          <h2>Related content</h2>
          <Card.Group itemsPerRow={4}>
            {children.map((item, index) => {
              return (
                <Card
                  href={`/datahub/view/${item.metadataIdentifier}`}
                  key={index}
                >
                  <Image src={item.overview[0].url} wrapped ui={false} />
                  <Card.Content>
                    <Card.Description>
                      {item.resourceTitleObject.default}
                    </Card.Description>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </div>
      )}

      <div className="below-content-wrapper">
        <Accordion exclusive={false}>
          <Accordion.Title
            active={activeIndex.includes(0)}
            index={0}
            onClick={toggleOpenAccordion}
          >
            Metadata
            <Icon className="ri-arrow-down-s-line" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(0)}>
            {!!item?.rod && (
              <div>
                Reporting obligations (ROD):
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
                Organisation:
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
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex.includes(1)}
            index={1}
            onClick={toggleOpenAccordion}
          >
            Permalinks
            <Icon className="ri-arrow-down-s-line" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(1)}>
            [No data]
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex.includes(2)}
            index={2}
            onClick={toggleOpenAccordion}
          >
            Geographic coverage
            <Icon className="ri-arrow-down-s-line" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(2)}>
            {item.spatial && (
              <div className="geotags">
                {Array.isArray(item?.spatial?.raw) ? (
                  <>
                    {item?.spatial?.raw.map((item, i) => {
                      return <span key={i}>{item}</span>;
                    })}
                  </>
                ) : (
                  <span>{item?.spatial?.raw}</span>
                )}
              </div>
            )}
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex.includes(3)}
            index={3}
            onClick={toggleOpenAccordion}
          >
            Temporal coverage
            <Icon className="ri-arrow-down-s-line" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(3)}>
            {/*<ul>
              {resourceTemporalDateRange?.map((temp, i) => {
                return (
                  <li key={i}>
                    <DateTime format="DATE_MED" value={temp.gte} /> -
                    <DateTime format="DATE_MED" value={temp.lte} />
                  </li>
                );
              })}
            </ul>*/}
            <TemporalCoverage temporalCoverage={time_coverage?.raw} />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex.includes(4)}
            index={4}
            onClick={toggleOpenAccordion}
          >
            Topics
            <Icon className="ri-arrow-down-s-line" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(4)}>
            {item.topic && (
              <>
                {Array.isArray(item?.topic?.raw) ? (
                  <>
                    {item?.topic?.raw.map((item, i) => {
                      return (
                        <span className="tag-item" key={i}>
                          {item}
                        </span>
                      );
                    })}
                  </>
                ) : (
                  <span className="tag-item">{item?.topic?.raw}</span>
                )}
              </>
            )}
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex.includes(5)}
            index={5}
            onClick={toggleOpenAccordion}
          >
            Tags
            <Icon className="ri-arrow-down-s-line" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(5)}>
            <div className="dataset-tags">
              {raw_value?.raw['allKeywords.th_EEAkeywordlist.keywords']?.map(
                (tag, i) => {
                  return (
                    <span className="tag-item" key={i}>
                      {tag.default}
                    </span>
                  );
                },
              )}
            </div>
          </Accordion.Content>
        </Accordion>
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
