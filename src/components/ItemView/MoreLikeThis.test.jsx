import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('MoreLikeThis', () => {
  it('renders loading state', () => {
    render(<div>More like this</div>);
  });
});
