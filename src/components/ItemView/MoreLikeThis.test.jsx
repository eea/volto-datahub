import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { runRequest } from '@eeacms/search';
import '@testing-library/jest-dom/extend-expect';

import MoreLikeThis from './MoreLikeThis';

jest.mock('@eeacms/search', () => {
  return {
    runRequest: jest.fn(),
    firstWords: jest.fn((word, length) =>
      word.split(' ').slice(0, length).join(' '),
    ),
  };
});

describe('MoreLikeThis', () => {
  const title = 'Test title';
  const docid = '123';
  const appConfig = {
    index_name: 'test_index',
  };

  it('renders similar content section when data is returned', async () => {
    runRequest.mockResolvedValueOnce({
      body: {
        hits: {
          hits: [
            {
              _source: {
                about: '456',
                label: 'Similar item 1',
                description: 'Description 1',
              },
            },
            {
              _source: {
                about: '789',
                label: 'Similar item 2',
                description: 'Description 2',
              },
            },
          ],
        },
      },
    });

    render(<MoreLikeThis title={title} docid={docid} appConfig={appConfig} />);

    expect(screen.queryByText('Similar content')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Similar content')).toBeInTheDocument();
      expect(screen.getByText('Similar item 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Similar item 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('does not render similar content section when no data is returned', async () => {
    runRequest.mockResolvedValueOnce({ body: { hits: { hits: [] } } });

    render(<MoreLikeThis title={title} docid={docid} appConfig={appConfig} />);

    await waitFor(() => {
      expect(screen.queryByText('Similar content')).not.toBeInTheDocument();
    });
  });
});
