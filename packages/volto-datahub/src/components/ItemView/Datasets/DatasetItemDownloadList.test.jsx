import React from 'react';
import { render, screen } from '@testing-library/react';
import { groupBy } from '@eeacms/volto-datahub/utils';
import DatasetUrls from './DatasetUrls';
import DatasetLinks from './DatasetLinks';
import DatasetEsri from './DatasetEsri';
import DatasetHttpLinks from './DatasetHttpLinks';
import '@testing-library/jest-dom';

import DatasetItemDownloadList from './DatasetItemDownloadList';

vi.mock('@eeacms/search', () => ({
  runRequest: vi.fn(),
}));
vi.mock('./DatasetUrls', () => ({ default: vi.fn(() => null) }));
vi.mock('./DatasetLinks', () => ({ default: vi.fn(() => null) }));
vi.mock('./DatasetEsri', () => ({ default: vi.fn(() => null) }));
vi.mock('./DatasetHttpLinks', () => ({ default: vi.fn(() => null) }));

describe('DatasetItemDownloadList', () => {
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

  it('renders download section when dataset has WWW:URL, WWW:LINK, EEA:FILEPATH, or EEA:FOLDERPATH', () => {
    const dataset = groupBy(link, 'protocol');
    render(<DatasetItemDownloadList link={link} />);

    expect(screen.getByText('Download:')).toBeInTheDocument();
    expect(DatasetUrls).toHaveBeenCalledWith({ dataset }, expect.anything());
    expect(DatasetLinks).toHaveBeenCalledWith({ dataset }, expect.anything());
  });

  it('does not render download section when dataset has no WWW:URL, WWW:LINK, EEA:FILEPATH, or EEA:FOLDERPATH', () => {
    render(<DatasetItemDownloadList link={[]} />);

    expect(screen.queryByText('Download:')).not.toBeInTheDocument();
  });

  it('renders DatasetEsri component', () => {
    const dataset = groupBy(link, 'protocol');
    render(<DatasetItemDownloadList link={link} />);

    expect(DatasetEsri).toHaveBeenCalledWith({ dataset }, expect.anything());
  });

  it('renders DatasetHttpLinks component', () => {
    const dataset = groupBy(link, 'protocol');
    render(<DatasetItemDownloadList link={link} />);

    expect(DatasetHttpLinks).toHaveBeenCalledWith(
      { dataset },
      expect.anything(),
    );
  });
});
