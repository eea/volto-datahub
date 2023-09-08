import React from 'react';
import renderer from 'react-test-renderer';

import DatasetHttpLinks from './DatasetHttpLinks';

jest.mock('@eeacms/search', () => ({
  runRequest: jest.fn(),
}));

const dataset = {
  'WWW:LINK-1.0-http--link': [
    {
      id: 1,
      url: 'https://example.org/1',
      protocol: 'https',
      name: 'First',
      description: 'Something here',
    },
  ],
  DOI: [
    {
      id: 1,
      url: 'https://example.org/1',
      protocol: 'https',
      name: 'First',
      description: 'Something here',
    },
  ],
};

describe('DatasetHttpLinks', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<DatasetHttpLinks dataset={dataset} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
