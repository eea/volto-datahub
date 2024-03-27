import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { isInternalURL } from '@eeacms/volto-datahub/utils';

import DatasetHttpLinks from './DatasetHttpLinks';

jest.mock('@eeacms/search', () => ({
  runRequest: jest.fn(),
}));

jest.mock('@eeacms/volto-datahub/utils', () => ({
  isInternalURL: jest.fn(),
}));

jest.mock('remixicon/icons/System/lock-line.svg', () => 'MockLockIcon');

describe('DatasetHttpLinks', () => {
  const dataset = {
    'WWW:LINK-1.0-http--link': [
      {
        url: 'https://example.org/1',
        name: 'Example Link',
        description: 'This is an example link',
      },
    ],
    DOI: [
      {
        url: 'https://doi.org/example',
        name: 'Example DOI',
        description: 'This is an example DOI',
      },
    ],
  };

  it('renders links section when dataset has WWW:LINK-1.0-http--link or DOI', () => {
    render(<DatasetHttpLinks dataset={dataset} />);

    expect(screen.getByText('Links:')).toBeInTheDocument();
  });

  it('does not render links section when dataset has no WWW:LINK-1.0-http--link or DOI', () => {
    render(<DatasetHttpLinks dataset={{}} />);

    expect(screen.queryByText('Links:')).not.toBeInTheDocument();
  });

  it('renders WWW:LINK-1.0-http--link items', () => {
    render(<DatasetHttpLinks dataset={dataset} />);

    expect(screen.getByText('Example Link')).toBeInTheDocument();
    expect(screen.getByText('This is an example link')).toBeInTheDocument();
  });

  it('renders DOI items', () => {
    render(<DatasetHttpLinks dataset={dataset} />);

    expect(screen.getByText('Example DOI')).toBeInTheDocument();
    expect(screen.getByText('This is an example DOI')).toBeInTheDocument();
  });

  it('renders lock icon for internal URLs', () => {
    isInternalURL.mockReturnValue(true);
    const internalDataset = {
      'WWW:LINK-1.0-http--link': [
        {
          url: 'https://internal.com',
          name: 'Internal Link',
        },
      ],
    };

    const { container } = render(
      <DatasetHttpLinks dataset={internalDataset} />,
    );

    expect(container.querySelector('svg.icon')).toBeInTheDocument();
  });
});
