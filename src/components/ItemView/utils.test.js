import { render, cleanup, fireEvent } from '@testing-library/react';
import { SVGIcon } from './utils';
import {
  isObsolete,
  isInternalURL,
  isInternal,
  groupBy,
} from '@eeacms/volto-datahub/utils';

describe('isObsolete', () => {
  it('should return true if status array contains obsolete keys', () => {
    const status = [{ key: 'obsolete' }, { key: 'active' }];
    expect(isObsolete(status)).toBe(true);
  });

  it('should return true if single status object key is obsolete', () => {
    const status = { key: 'superseded' };
    expect(isObsolete(status)).toBe(true);
  });

  it('should return false if status array does not contain obsolete keys', () => {
    const status = [{ key: 'active' }];
    expect(isObsolete(status)).toBe(false);
  });

  it('should return false if single status object key is not obsolete', () => {
    const status = { key: 'active' };
    expect(isObsolete(status)).toBe(false);
  });

  it('should return false if status is undefined', () => {
    const status = undefined;
    expect(isObsolete(status)).toBe(false);
  });
});

describe('isInternalURL', () => {
  it('should return true if a part of the URL contains "_i" as the seventh substring split by "_"', () => {
    const url = 'https://test.com/a/b/c/d/e/f/h_i_j_k_l_m_i_n/o/p';
    expect(isInternalURL(url)).toBe(true);
  });

  it('should return false if no part of the URL contains "_i" as the seventh substring split by "_"', () => {
    const url = 'https://test.com/a/b/c/d/e/f/h_i_j_k_l_m_n/o/p';
    expect(isInternalURL(url)).toBe(false);
  });
});

describe('isInternal', () => {
  it('should return true if any link in the item is internal', () => {
    const item = {
      link: [{ url: 'https://test.com/a/b/c/d/e/f/h_i_j_k_l_m_i_n/o/p' }],
    };
    expect(isInternal(item)).toBe(true);
  });

  it('should return false if link is undefined', () => {
    const item = {
      link: undefined,
    };
    expect(isInternal(item)).toBe(false);
  });

  it('should return false if no link in the item is internal', () => {
    const item = {
      link: [{ url: 'https://test.com/a/b/c/d/e/f/h_i_j_k_l_m_n/o/p' }],
    };
    expect(isInternal(item)).toBe(false);
  });
});

describe('groupBy', () => {
  it('should group array of objects by specified key', () => {
    const arr = [
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
      { id: 1, name: 'test3' },
    ];
    expect(groupBy(arr, 'id')).toEqual({
      '1': [
        { id: 1, name: 'test1' },
        { id: 1, name: 'test3' },
      ],
      '2': [{ id: 2, name: 'test2' }],
    });
  });
});

describe('SVGIcon', () => {
  afterEach(cleanup);

  it('should render SVGIcon correctly', () => {
    const { container } = render(
      <SVGIcon
        name={{
          attributes: {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 32 32',
          },
          content: '<path d="M2 9h28l-14 14L2 9z"></path>',
        }}
        className={'test'}
        title={'test title'}
        size="32px"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    const { container } = render(
      <SVGIcon
        name={{
          attributes: {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 32 32',
          },
          content: '<path d="M2 9h28l-14 14L2 9z"></path>',
        }}
        size="32px"
        onClick={onClick}
      />,
    );
    fireEvent.click(container.getElementsByClassName('icon')[0]);
    expect(onClick).toHaveBeenCalled();
  });
});
