import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MetadataSection from './MetadataSection';

describe('MetadataSection', () => {
  const appConfig = {
    indexBaseUrl: 'https://example.com',
  };

  const docid = '123';

  it('renders metadata section when rod, organisations, or merged_time_coverage_range are available', () => {
    const item = {
      raw_value: {
        raw: {
          merged_time_coverage_range: [
            { start: '2020-01-01', end: '2020-12-31' },
          ],
        },
      },
      organisation: {
        raw: ['Organisation 1', 'Organisation 2'],
      },
      rod: {
        raw: ['ROD 1', 'ROD 2'],
      },
    };

    render(<MetadataSection item={item} appConfig={appConfig} docid={docid} />);

    expect(screen.getByText('More information')).toBeInTheDocument();
    expect(screen.getByText('Reporting obligations (ROD)')).toBeInTheDocument();
    expect(screen.getByText('ROD 1')).toBeInTheDocument();
    expect(screen.getByText('ROD 2')).toBeInTheDocument();
    expect(screen.getByText('Organisation:')).toBeInTheDocument();
    expect(screen.getByText('Organisation 1')).toBeInTheDocument();
    expect(screen.getByText('Organisation 2')).toBeInTheDocument();
    expect(screen.getByText('Temporal coverage:')).toBeInTheDocument();
    expect(screen.getByText('2020-01-01 - 2020-12-31')).toBeInTheDocument();
  });

  it('does not render metadata section when rod, organisations, and merged_time_coverage_range are not available', () => {
    const item = {
      raw_value: {
        raw: {},
      },
    };

    render(<MetadataSection item={item} appConfig={appConfig} docid={docid} />);

    expect(screen.queryByText('More information')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Reporting obligations (ROD)'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Organisation:')).not.toBeInTheDocument();
    expect(screen.queryByText('Temporal coverage:')).not.toBeInTheDocument();
  });

  it('renders metadata factsheet and catalogue links', () => {
    render(<MetadataSection appConfig={appConfig} docid={docid} />);

    expect(screen.getByText('Metadata Factsheet')).toHaveAttribute(
      'href',
      `${appConfig.indexBaseUrl}/catalogue/datahub/api/records/${docid}/formatters/xsl-view?output=pdf&language=eng&approved=true`,
    );
    expect(screen.getByText('Metadata catalogue')).toHaveAttribute(
      'href',
      `${appConfig.indexBaseUrl}/catalogue/srv/eng/catalog.search#/metadata/${docid}`,
    );
  });
});
