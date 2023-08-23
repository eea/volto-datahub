import React from 'react';
import { Tab, Menu } from 'semantic-ui-react';

import DatasetItemsList from './DatasetItemsList';

const DatasetsTab = (props) => {
  const { items, appConfig } = props;

  const [filterValue, setFilterValue] = React.useState('');

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [activeAccordionId, setActiveAccordionId] = React.useState();
  const [initialAccordionId, setInitialAccordionId] = React.useState();

  React.useEffect(() => {
    if (!activeAccordionId) {
      const activeTab = items.filter((item) =>
        item.children.find((child) => child.id === initialAccordionId),
      );
      setActiveTabIndex(activeTab?.[0]?.id);
    }
  }, [activeAccordionId, initialAccordionId, items]);

  const handleTabChange = (e, { activeIndex }) => {
    setFilterValue('');
    setActiveTabIndex(activeIndex);
  };

  const handleFilteredValueChange = (value) => {
    setFilterValue(value);
  };

  const panes = (items || []).map((item, i) => ({
    menuItem: (
      <Menu.Item key={i} tabIndex={0}>
        {item.date ? <span>{item.date}</span> : 'No date'}
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        <DatasetItemsList
          item={item}
          appConfig={appConfig}
          filterValue={filterValue}
          setActiveTabIndex={setActiveTabIndex}
          setActiveAccordionId={setActiveAccordionId}
          setInitialAccordionId={setInitialAccordionId}
          handleFilteredValueChange={handleFilteredValueChange}
        />
      </Tab.Pane>
    ),
  }));

  return (
    <Tab
      panes={panes}
      className="datasets-tab"
      activeIndex={activeTabIndex}
      onTabChange={handleTabChange}
      menu={{ vertical: true, secondary: true, pointing: true }}
    />
  );
};

export default DatasetsTab;
