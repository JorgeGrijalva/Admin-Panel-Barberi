import React, { useMemo, useState } from 'react';
import { Spin, TreeSelect } from 'antd';
import debounce from 'lodash/debounce';

export const AsyncTreeSelect = ({
  fetchOptions,
  refetch = false,
  debounceTimeout = 400,
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const fetchOnFocus = () => {
    if (!treeData.length || refetch) {
      setFetching(true);
      fetchOptions().then((newOptions) => {
        setTreeData(newOptions);
        setFetching(false);
      });
    }
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setTreeData([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        setTreeData(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, []);

  return (
    <TreeSelect
      showSearch
      labelInValue
      filterTreeNode={(value, node) => {
        return node.label.localeCompare(value);
      }}
      treeLine={true}
      onSearch={(value) => debounceFetcher(value)}
      treeData={fetching ? [] : treeData}
      treeDefaultExpandAll
      onFocus={fetchOnFocus}
      notFoundContent={fetching ? <Spin size='small' /> : 'no results'}
      {...props}
    />
  );
};
