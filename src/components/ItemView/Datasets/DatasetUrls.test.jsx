import React from 'react';
import { render, screen } from '@testing-library/react';
import { isInternalURL } from '@eeacms/volto-datahub/utils';
import '@testing-library/jest-dom/extend-expect';

import DatasetUrls from './DatasetUrls';

jest.mock('remixicon/icons/System/lock-line.svg', () => 'MockLockIcon');
jest.mock('@eeacms/volto-datahub/utils', () => ({
  isInternalURL: jest.fn(),
}));

describe('DatasetUrls', () => {
  const dataset = {
    'WWW:URL': [
      {
        url: 'https://example.com/url1',
        name: 'Direct download',
        description: 'Download link description',
      },
      {
        url: 'https://example.com/url2',
        name: '',
        description: '',
      },
    ],
  };

  it('renders URLs from the dataset', () => {
    render(<DatasetUrls dataset={dataset} />);

    expect(screen.getByText('Direct download')).toBeInTheDocument();
    expect(screen.getByTitle('Download link description')).toBeInTheDocument();
  });

  it('renders lock icon for internal URLs', () => {
    isInternalURL.mockReturnValue(true);

    const { container } = render(<DatasetUrls dataset={dataset} />);

    expect(container.querySelector('svg.icon')).toBeInTheDocument();
  });

  it('does not render lock icon for external URLs', () => {
    isInternalURL.mockReturnValue(false);

    const { container } = render(<DatasetUrls dataset={dataset} />);

    expect(container.querySelector('svg.icon')).not.toBeInTheDocument();
  });
});
