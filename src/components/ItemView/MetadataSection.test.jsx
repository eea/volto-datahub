import React from 'react';
import renderer from 'react-test-renderer';

import MetadataSection from './MetadataSection';

describe('MetadataSection Component', () => {
  it('renders correctly with data', () => {
    const appConfig = {
      indexBaseUrl: 'https://sdi.eea.europa.eu',
    };

    const component = renderer.create(
      <MetadataSection appConfig={appConfig} />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
