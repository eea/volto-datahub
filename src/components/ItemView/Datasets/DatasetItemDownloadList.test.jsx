import React from 'react';
import renderer from 'react-test-renderer';

import DatasetItemDownloadList from './DatasetItemDownloadList';

jest.mock('@eeacms/search', () => ({
  runRequest: jest.fn(),
}));

const link = [
  {
    function: 'download',
    mimeType: '',
    protocol: 'WWW:URL',
    url: 'https://example.org/1',
    name: 'Direct download',
    group: 0,
  },
];

describe('DatasetItemDownloadList', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<DatasetItemDownloadList link={link} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
