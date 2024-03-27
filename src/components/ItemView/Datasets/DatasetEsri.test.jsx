import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import DatasetEsri from './DatasetEsri';

jest.mock('remixicon/icons/System/lock-line.svg', () => 'MockLockIcon');

describe('DatasetEsri', () => {
  const dataset = {
    'ESRI:REST': [
      {
        id: 1,
        url: 'https://example.org/1',
        protocol: 'https',
        name: 'First',
      },
    ],
  };

  it('renders services section when ESRI:REST data exists', () => {
    render(<DatasetEsri dataset={dataset} />);

    expect(screen.getByText('Services:')).toBeInTheDocument();
    expect(screen.getByText('https First')).toBeInTheDocument();
  });

  it('renders services section when OGC:WMS data exists', () => {
    render(<DatasetEsri dataset={{ 'OGC:WMS': dataset['ESRI:REST'] }} />);

    expect(screen.getByText('Services:')).toBeInTheDocument();
    expect(screen.getByText('https First')).toBeInTheDocument();
  });

  it('does not render services section when no data exists', () => {
    render(<DatasetEsri dataset={{}} />);

    expect(screen.queryByText('Services:')).not.toBeInTheDocument();
  });
});
