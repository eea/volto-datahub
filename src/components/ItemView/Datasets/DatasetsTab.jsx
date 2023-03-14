import React from 'react';
import { Tab, Menu } from 'semantic-ui-react';

import DatasetItemsList from './DatasetItemsList';

const DatasetsTab = (props) => {
  const { items, appConfig, defaultAccordionOpenIndex } = props;

  const [activeAccordionIndex, setActiveAccordionIndex] = React.useState(
    defaultAccordionOpenIndex,
  );

  React.useEffect(() => {
    if (defaultAccordionOpenIndex !== undefined) {
      setActiveAccordionIndex(defaultAccordionOpenIndex);
    } else {
      setActiveAccordionIndex(-1);
    }
  }, [defaultAccordionOpenIndex]);

  const panes = (items || []).map((item, i) => ({
    menuItem: (
      <Menu.Item key={i}>
        {item.date ? <span>{item.date}</span> : 'No date'}
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        <DatasetItemsList
          appConfig={appConfig}
          item={item}
          activeTabIndex={activeAccordionIndex}
          setActiveTabIndex={setActiveAccordionIndex}
        />
      </Tab.Pane>
    ),
  }));

  return (
    <>
      {items && items.length > 0 ? (
        <Tab
          className="datasets-tab"
          menu={{ vertical: true, secondary: true, pointing: true }}
          panes={panes}
          onTabChange={() => {
            setActiveAccordionIndex(0);
          }}
        />
      ) : null}
    </>
  );
};

export default DatasetsTab;
