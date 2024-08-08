import React, { useEffect, useState } from 'react';
import { Card, Image, Space, Table } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { fetchAdminStoreis, fetchStoreis } from '../../redux/slices/storeis';
import FilterColumns from '../../components/filter-column';
import { IMG_URL } from '../../configs/app-global';

const Storeis = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { storeis, meta, loading } = useSelector(
    (state) => state.storeis,
    shallowEqual
  );

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('image'),
      dataIndex: 'file_urls',
      key: 'file_urls',
      is_show: true,
      render: (file_urls) => {
        return (
          <Image
            src={
              file_urls
                ? file_urls[0].search('stories/')
                  ? IMG_URL + file_urls[0]
                  : 'https://api.foodyman.org/storage/' + file_urls[0]
                : 'https://via.placeholder.com/150'
            }
            alt='img_gallery'
            width={100}
            className='rounded'
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('product'),
      dataIndex: 'stock',
      key: 'stock',
      is_show: true,
      render: (_, row) => row?.product?.translation?.title,
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
      render: (_, row) => row.shop?.translation?.title,
    },
  ]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchAdminStoreis());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchStoreis({ perPage: pageSize, page: current }));
  };

  return (
    <Card
      title={t('storeis')}
      extra={
        <Space>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={storeis}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
    </Card>
  );
};

export default Storeis;
