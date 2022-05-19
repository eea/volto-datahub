import React from 'react';
import {
  Container,
  Grid,
  Card,
  Image,
  Accordion,
  Icon,
} from 'semantic-ui-react';
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
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import config from '@plone/volto/registry';

const appName = 'datahub';

function ItemView(props) {
  const { docid } = props;
  const result = useResult(null, docid);
  const item = result ? result._result : {};
  const { title, description, id, raw_value, event } = item;
  const { contactForResource, contact } = raw_value?.raw || {};
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

  // console.log('datahub item', item);
  // console.log('related datasets', children);

  return (
    <>
      {item ? (
        <div>
          <Portal node={document.getElementById('page-header')}>
            <div className="eea banner">
              <div className="gradient">
                <div className="ui container">
                  <div className="content">
                    <h1 className="documentFirstHeading">{title?.raw}</h1>
                  </div>
                </div>
              </div>
            </div>
          </Portal>
          <Callout>{description?.raw}</Callout>
          <h3>Tabular data</h3>
          <Accordion exclusive={false}>
            <Accordion.Title
              active={activeIndex.includes(0)}
              index={0}
              onClick={toggleOpenAccordion}
            >
              Distribution files
              <Icon className="ri-arrow-down-s-line" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(0)}>
              <p></p>
            </Accordion.Content>

            <Accordion.Title
              active={activeIndex.includes(1)}
              index={1}
              onClick={toggleOpenAccordion}
            >
              Programmatic access (APIs)
              <Icon className="ri-arrow-down-s-line" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(1)}>
              <a
                href="https://discodata.eea.europa.eu/#!/"
                title="DiscoData REST API call"
                rel="noopener noreferrer"
              >
                DiscoData
              </a>
              (REST API)
            </Accordion.Content>

            <Accordion.Title
              active={activeIndex.includes(2)}
              index={2}
              onClick={toggleOpenAccordion}
            >
              Additional information
              <Icon className="ri-arrow-down-s-line" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(2)}>
              {description?.raw}
            </Accordion.Content>

            <Accordion.Title
              active={activeIndex.includes(3)}
              index={3}
              onClick={toggleOpenAccordion}
            >
              Metadata
              <Icon className="ri-arrow-down-s-line" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(3)}>
              Topics:
              <ul>
                {raw_value?.raw['allKeywords.th_eea-topics.keywords']?.map(
                  (topic, i) => {
                    return (
                      <li key={i}>
                        <a href={topic.link} target="_blank" rel="noreferrer">
                          {topic.default}
                        </a>
                      </li>
                    );
                  },
                )}
              </ul>
            </Accordion.Content>
          </Accordion>

          <h3>Geospatial data</h3>

          <h3>Additional information</h3>
          <Accordion exclusive={false}>
            <Accordion.Title
              active={activeIndex.includes(4)}
              index={4}
              onClick={toggleOpenAccordion}
            >
              About this dataset
              <Icon className="ri-arrow-down-s-line" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(4)}>
              {description?.raw}
            </Accordion.Content>

            <Accordion.Title
              active={activeIndex.includes(5)}
              index={5}
              onClick={toggleOpenAccordion}
            >
              Contact information
              <Icon className="ri-arrow-down-s-line" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(5)}>
              {contactForResource ? (
                <>
                  {contactForResource.map((c, i) => {
                    return (
                      <Grid key={i}>
                        <Grid.Column width={4}>
                          <p>{c.role}: </p>
                        </Grid.Column>
                        <Grid.Column width={8}>
                          <a
                            href="https://www.eea.europa.eu/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <strong>{c.organisation}</strong>
                          </a>
                          <p>{c.address}</p>
                          <a href={'mailto:' + c.email}>{c.email}</a>
                        </Grid.Column>
                      </Grid>
                    );
                  })}
                </>
              ) : (
                <>
                  {contact &&
                    contact.length > 0 &&
                    contact.map((c, i) => {
                      return (
                        <Grid key={i}>
                          <Grid.Column width={4}>
                            {/*<p>{contact.role}: </p>*/}
                            <p>Point of contact:</p>
                          </Grid.Column>
                          <Grid.Column width={8}>
                            <a
                              href="https://www.eea.europa.eu/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <strong>{c.organisation}</strong>
                            </a>
                            <p>{c.address}</p>
                            <a href={'mailto:' + c.email}>{c.email}</a>
                          </Grid.Column>
                        </Grid>
                      );
                    })}
                </>
              )}
            </Accordion.Content>
          </Accordion>

          <h3>Related datasets</h3>
          {children && children.length > 0 && (
            <Card.Group itemsPerRow={3}>
              {children.map((item, index) => {
                return (
                  <Card
                    href={`/datahub/view/${item.metadataIdentifier}`}
                    key={index}
                  >
                    <Image src={item.overview[0].url} wrapped ui={false} />
                    <Card.Content>
                      <Card.Header>
                        {item.resourceTitleObject.default}
                      </Card.Header>
                    </Card.Content>
                  </Card>
                );
              })}
            </Card.Group>
          )}

          <p>
            Source: SDI record{' '}
            <a
              href={
                'https://galliwasp.eea.europa.eu/catalogue/srv/eng/catalog.search#/metadata/' +
                id
              }
            >
              {id}
            </a>
          </p>
        </div>
      ) : (
        ''
      )}
    </>
  );
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
