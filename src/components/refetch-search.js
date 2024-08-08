import React, { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin } from 'antd';

export const RefetchSearch = ({
  fetchOptions,
  debounceTimeout = 400,
  refetch = false,
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  const fetchOnFocus = () => {
    if (!options.length || refetch) {
      debounceFetcher('');
    }
  };

  return (
    <Select
      showSearch
      allowClear
      labelInValue={true}
      onClear={() => debounceFetcher('')}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : 'no results'}
      {...props}
      options={options}
      onFocus={fetchOnFocus}
    />
  );
};
