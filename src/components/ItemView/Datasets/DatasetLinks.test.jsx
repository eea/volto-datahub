import React from 'react';
import renderer from 'react-test-renderer';

import DatasetLinks from './DatasetLinks';

jest.mock('@eeacms/search', () => ({
  runRequest: jest.fn(),
}));

const dataset = {
  'WWW:LINK': [
    {
      id: 1,
      url: 'https://example.org/1',
      protocol: 'https',
      name: 'First',
      description: 'Something here',
    },
  ],
};

describe('DatasetEsri', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<DatasetLinks dataset={dataset} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
