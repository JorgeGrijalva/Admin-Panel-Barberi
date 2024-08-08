import { Table } from 'antd';
import React from 'react';

const CustomTable = ({
  rowSelection,
  columns,
  users,
  loading,
  params,
  activeMenu,
  meta,
  onChangePagination,
}) => {
  return (
    <div>
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={users}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record?.id}
        onChange={onChangePagination}
      />
    </div>
  );
};

export default CustomTable;
