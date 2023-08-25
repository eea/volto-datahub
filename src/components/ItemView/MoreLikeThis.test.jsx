import React from 'react';
import renderer from 'react-test-renderer';

import MoreLikeThis from './MoreLikeThis';

jest.mock('@eeacms/search', () => ({
  runRequest: jest.fn(),
}));

describe('MoreLikeThis', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<MoreLikeThis appConfig={{}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
