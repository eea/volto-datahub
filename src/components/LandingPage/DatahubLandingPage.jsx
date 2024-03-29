import React from 'react';

import { Tab, Menu, Divider, List } from 'semantic-ui-react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useAtom } from 'jotai';

import {
  customOrder,
  showFacetsAsideAtom,
  getFacetCounts,
  buildStateFacets,
  useLandingPageData,
  useLandingPageRequest,
  Icon,
  Term,
} from '@eeacms/search';

const getFacetConfig = (sections, name) => {
  return sections?.find((facet) => facet.facetField === name);
};

const cmp = (a, b, sortOrder) => {
  const modifier = sortOrder === 'desc' ? -1 : 1;
  return a > b ? modifier * 1 : a === b ? 0 : modifier * -1;
};

const sortedTiles = (tiles, sectionConfig, appConfig) => {
  if (sectionConfig.sortOn === 'custom') {
    const fConfig = appConfig.facets.filter(
      (f) => f.field === sectionConfig.facetField,
    );
    const facetValues = fConfig[0].facetValues;
    return customOrder(tiles, facetValues);
  } else {
    return tiles.sort((a, b) =>
      sectionConfig.sortOn === 'alpha'
        ? cmp(a.value, b.value, sectionConfig.sortOrder || 'asc')
        : cmp(a.count, b.count, sectionConfig.sortOrder || 'asc'),
    );
  }
};

const LandingPage = (props) => {
  const { appConfig, children, setFilter, setSort } = props;
  const { appName } = appConfig;
  const { onlyLandingPage = false } = appConfig;

  const {
    sections = [],
    maxPerSection = 12,
    sortField,
    sortDirection,
  } = appConfig.initialView.tilesLandingPageParams;

  const sectionFacetFields = sections.map((s) => s.facetField);
  const [activeSection, setActiveSection] = React.useState(
    sections?.[0]?.facetField,
  );

  const [, setShowFacets] = useAtom(showFacetsAsideAtom);

  const [landingPageData, setLandingPageData] = useLandingPageData(appName);
  const [isRequested, setIsRequested] = useLandingPageRequest(appName);

  // const [landingPageData, setLandingPageData] = useAtom(landingPageDataAtom);
  // const [isRequested, setIsRequested] = useAtom(isRequestedAtom);

  const getTiles = (maxPerSection) => {
    let result = landingPageData?.[activeSection]?.[0]?.data || [];

    // if (activeSection === 'language') {
    //   const fConfig = appConfig.facets.filter((f) => f.field === 'language');
    //   const languages = fConfig[0].facetValues;
    //   result = customOrder(result, languages);
    // }
    return [result.length > maxPerSection, result.slice(0, maxPerSection)];
  };

  const [hasOverflow, tiles] = getTiles(maxPerSection);

  const allSeries = () => {
    return landingPageData?.['cluster_name']?.[0]?.data[0] || {};
  };
  const all_series = allSeries();

  const activeSectionConfig = getFacetConfig(sections, activeSection);

  const { icon } = activeSectionConfig;

  const fixedOnClickHandler = () => {
    setFilter('cluster_name', 'sdi', 'any');
    appConfig.facets
      .filter((f) => f.field !== 'cluster_name' && f.default)
      .forEach((facet) => {
        facet.default.values.forEach((value) =>
          setFilter(facet.field, value, facet.default.type || 'any'),
        );
      });
    setSort(sortField, sortDirection);
    setShowFacets(true);
  };

  useDeepCompareEffect(() => {
    async function fetchFacets() {
      let facets;
      if (!isRequested) {
        setIsRequested(true);
      } else {
        return;
      }

      if (!landingPageData) {
        const state = {
          filters: (sections || [])
            .filter((f) => f.filterType === 'any:exact')
            .map(({ facetField, filterType = 'any' }) => ({
              field: facetField,
              values: [],
              type: filterType,
            })),
        };
        const facetCounts = await getFacetCounts(
          state,
          appConfig,
          sectionFacetFields,
        );
        facets = buildStateFacets(facetCounts, appConfig);
      }

      if (!landingPageData && facets) {
        setLandingPageData(facets);
      }
    }
    if (!landingPageData) {
      fetchFacets();
    }
  }, [
    isRequested,
    setIsRequested,
    appConfig,
    sectionFacetFields,
    landingPageData,
    setLandingPageData,
    sections,
  ]);

  const panes = sections
    .filter((section) => !section.hidden)
    .map((section, index) => {
      const tabIndex = index + 1;

      return {
        id: section,
        menuItem: {
          children: () => {
            return (
              <React.Fragment key={`tab-${tabIndex}`}>
                <Menu.Item
                  tabIndex={0}
                  active={activeSection === section.facetField}
                  onClick={() => setActiveSection(section.facetField)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActiveSection(section.facetField);
                    }
                  }}
                >
                  {section.title}
                </Menu.Item>
              </React.Fragment>
            );
          },
        },
        render: () => {
          return (
            <Tab.Pane tabIndex={0}>
              <div className={`landing-page-cards ${activeSection}`}>
                <List>
                  {sortedTiles(tiles, activeSectionConfig, appConfig).map(
                    (topic, index) => {
                      const onClickHandler = () => {
                        setFilter(
                          activeSection,
                          topic.value,
                          activeSectionConfig.filterType || 'any',
                        );

                        // apply configured default values
                        appConfig.facets
                          .filter((f) => f.field !== activeSection && f.default)
                          .forEach((facet) => {
                            facet.default.values.forEach((value) =>
                              setFilter(
                                facet.field,
                                value,
                                facet.default.type || 'any',
                              ),
                            );
                          });
                        setSort(sortField, sortDirection);
                        setShowFacets(true);
                      };

                      return (
                        <List.Item
                          key={index}
                          tabIndex={0}
                          onClick={onClickHandler}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onClickHandler();
                            }
                          }}
                        >
                          <List.Content>
                            {icon ? <Icon {...icon} type={topic.value} /> : ''}
                            <Term term={topic.value} field={activeSection} />
                            <span className="count">
                              ({topic.count}{' '}
                              {topic.count === 1 ? 'item' : 'items'})
                            </span>
                          </List.Content>
                        </List.Item>
                      );
                    },
                  )}
                </List>
              </div>
            </Tab.Pane>
          );
        },
      };
    });

  return (
    <div className="landing-page-container">
      <div className="landing-page">
        {!onlyLandingPage && <h4 className="browse-by">Browse by</h4>}
        <Tab
          className="search-tab"
          menu={{ secondary: true, pointing: true }}
          panes={panes}
        />
        {hasOverflow ? (
          <div className="tab-info">
            <p>Only first {maxPerSection} items are displayed.</p>
          </div>
        ) : null}
        {children}
        <Divider />
        <div className="landing-page-cards">
          <List>
            <List.Item>
              <List.Content>
                <div
                  key="all_series"
                  tabIndex="0"
                  role="button"
                  onKeyDown={fixedOnClickHandler}
                  onClick={fixedOnClickHandler}
                >
                  <div className="extra content">
                    <span className="count">
                      See all {all_series.count} datasets
                    </span>
                  </div>
                </div>
              </List.Content>
            </List.Item>
          </List>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
