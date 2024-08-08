import React, { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin } from 'antd';

export const DebounceSelect = ({
  fetchOptions,
  debounceTimeout = 400,
  onClear,
  refetchOptions = false,
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
    if (!options.length || refetchOptions) {
      debounceFetcher('');
    }
  };

  return (
    <Select
      showSearch
      allowClear
      labelInValue={true}
      filterOption={false}
      onSearch={debounceFetcher}
      onClear={() => {
        debounceFetcher('');
        !!onClear && onClear();
      }}
      notFoundContent={fetching ? <Spin size='small' /> : 'no results'}
      {...props}
      options={options}
      onFocus={fetchOnFocus}
    />
  );
};
