import React, { useState } from 'react';
import { Spin, TreeSelect } from 'antd';

export const AsyncTreeSelect = ({
  fetchOptions,
  refetch = false,
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

  return (
    <TreeSelect
      treeLine={true}
      treeData={fetching ? [] : treeData}
      treeDefaultExpandAll
      labelInValue
      onFocus={fetchOnFocus}
      notFoundContent={fetching ? <Spin size='small' /> : 'no results'}
      {...props}
    />
  );
};
