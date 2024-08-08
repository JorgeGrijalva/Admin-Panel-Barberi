import React, { useEffect, useState } from 'react';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tag } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../../redux/slices/menu';
import useDidUpdate from '../../../helpers/useDidUpdate';
import formatSortType from '../../../helpers/formatSortType';
import { useTranslation } from 'react-i18next';
import { fetchSellerWallets } from '../../../redux/slices/wallet';
import numberToPrice from '../../../helpers/numberToPrice';
import PayoutStatusModal from './payoutStatusModal';
import PayoutRequest from './payoutRequest';
import FilterColumns from '../../../components/filter-column';
import moment from 'moment';

export default function SellerPayouts() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price) => numberToPrice(price, defaultCurrency?.symbol),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status, row) => (
        <div>
          {status === 'processed' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'rejected' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          {status === 'processed' ? (
            <EditOutlined onClick={() => setModal(row)} />
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: t('note'),
      dataIndex: 'note',
      key: 'note',
      is_show: true,
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format('YYYY-MM-DD HH:mm'),
    },
  ]);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { wallets, meta, loading, params } = useSelector(
    (state) => state.wallet,
    shallowEqual,
  );

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchSellerWallets({}));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
    };
    dispatch(fetchSellerWallets(paramsData));
  }, [activeMenu.data]);

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({ activeMenu, data: { perPage, page, column, sort } }),
    );
  }

  return (
    <Card
      title={t('payouts')}
      extra={
        <Space>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => setWithdrawModal(true)}
          >
            {t('withdraw')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={wallets}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />
      {modal && (
        <PayoutStatusModal data={modal} handleCancel={() => setModal(null)} />
      )}
      {withdrawModal && (
        <PayoutRequest
          data={withdrawModal}
          handleCancel={() => setWithdrawModal(false)}
        />
      )}
    </Card>
  );
}
