import React from 'react';
import { Tab, Menu } from 'semantic-ui-react';

import DatasetItemsList from './DatasetItemsList';

const DatasetsTab = (props) => {
  const { items, appConfig } = props;

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [activeAccordionId, setActiveAccordionId] = React.useState();
  const [filterValue, setFilterValue] = React.useState('');

  React.useEffect(() => {
    const lastAccordionSelected =
      activeAccordionId?.[activeAccordionId.length - 1];

    const activeTab = items.filter((item) =>
      item.children.find((child) => child.id === lastAccordionSelected),
    );
    setActiveTabIndex(activeTab?.[0]?.id);
  }, [activeAccordionId, items]);

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
          setActiveAccordion={setActiveAccordionId}
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
