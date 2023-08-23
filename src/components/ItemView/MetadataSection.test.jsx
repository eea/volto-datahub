import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MetadataSection from './MetadataSection';

describe('MetadataSection Component', () => {
  it('renders correctly with data', () => {
    const appConfig = {
      indexBaseUrl: 'https://sdi.eea.europa.eu',
    };

    render(<MetadataSection appConfig={appConfig} />);
  });
});
