import React from 'react';
import renderer from 'react-test-renderer';

import DatasetUrls from './DatasetUrls';

jest.mock('@eeacms/search', () => ({
  runRequest: jest.fn(),
}));

const dataset = {
  'WWW:URL': [
    {
      url: 'https://example.org/1',
      name: 'Direct download',
      description: 'Download link description',
    },
  ],
};

describe('DatasetUrl', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<DatasetUrls dataset={dataset} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
