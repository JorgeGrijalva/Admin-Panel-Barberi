import React, { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin } from 'antd';

export const InfiniteSelect = ({
  fetchOptions,
  debounceTimeout = 400,
  hasMore,
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setSearch(value);
      setFetching(true);
      fetchOptions({ search: value })
        .then((newOptions) => {
          setOptions(newOptions);
          setCurrentPage(2);
          setFetching(false);
        })
        .finally(() => setLoading(false));
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, currentPage]);

  const fetchOnFocus = () => {
    if (!options.length) {
      debounceFetcher('');
    }
  };

  const onScroll = async (event) => {
    const target = event.target;
    if (
      !loading &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      if (hasMore) {
        setLoading(true);
        target.scrollTo(0, target.scrollHeight);
        fetchOptions({ search: search, page: currentPage })
          .then((item) => {
            setCurrentPage((i) => i + 1);
            setOptions([...options, ...item]);
          })
          .finally(() => setLoading(false));
      }
    }
  };

  return (
    <Select
      showSearch
      allowClear
      onPopupScroll={onScroll}
      labelInValue={true}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : 'no results'}
      onFocus={fetchOnFocus}
      {...props}
    >
      {options.map((item, index) => (
        <Select.Option key={index} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
      {loading && (
        <Select.Option>
          <Spin size='small' />
        </Select.Option>
      )}
    </Select>
  );
};
