import React from 'react';
import { render, screen } from '@testing-library/react';
import { isInternalURL } from '@eeacms/volto-datahub/utils';
import '@testing-library/jest-dom/extend-expect';

import DatasetLinks from './DatasetLinks';

jest.mock('remixicon/icons/System/lock-line.svg', () => 'MockLockIcon');
jest.mock('@eeacms/volto-datahub/utils', () => ({
  isInternalURL: jest.fn(),
}));

describe('DatasetLinks', () => {
  const dataset = {
    'WWW:LINK': [
      {
        url: 'https://example.com/link1',
        name: 'Link 1',
      },
      {
        url: 'https://example.com/link2',
        name: '',
      },
    ],
  };

  it('renders links from the dataset', () => {
    render(<DatasetLinks dataset={dataset} />);

    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Download link')).toBeInTheDocument();
  });

  it('renders lock icon for internal URLs', () => {
    isInternalURL.mockReturnValue(true);

    const { container } = render(<DatasetLinks dataset={dataset} />);

    expect(container.querySelector('svg.icon')).toBeInTheDocument();
  });

  it('does not render lock icon for external URLs', () => {
    isInternalURL.mockReturnValue(false);

    const { container } = render(<DatasetLinks dataset={dataset} />);

    expect(container.querySelector('svg.icon')).not.toBeInTheDocument();
  });
});
