import React, { useState } from 'react';
import { Select, Spin } from 'antd';

export const AsyncSelect = ({
  fetchOptions,
  refetch = false,
  value,
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  if (typeof value?.label === 'object' && value?.label !== null) {
    value.label = value.label.value;
  }

  const fetchOnFocus = () => {
    if (!options.length || refetch) {
      setFetching(true);
      fetchOptions().then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    }
  };

  return (
    <>
      <Select
        labelInValue={true}
        filterOption={false}
        notFoundContent={fetching ? <Spin size='small' /> : 'no results'}
        value={value}
        {...props}
        options={fetching ? [] : options}
        onFocus={fetchOnFocus}
        getPopupContainer={(trigger) => trigger.parentNode}
      />
    </>
  );
};
