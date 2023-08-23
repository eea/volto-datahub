import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MoreLikeThis from './MoreLikeThis';

describe('MoreLikeThis', () => {
  it('renders loading state', () => {
    const { container } = render(<MoreLikeThis appConfig={{}} />);
    expect(container.innerHTML).toBe('');
  });
});
