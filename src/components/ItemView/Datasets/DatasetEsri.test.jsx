import React from 'react';
import renderer from 'react-test-renderer';

import DatasetEsri from './DatasetEsri';

jest.mock('@eeacms/search', () => ({
  runRequest: jest.fn(),
}));

const dataset = {
  'ESRI:REST': [
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
    const tree = renderer.create(<DatasetEsri dataset={dataset} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
