import { Button, Card, Table, Tag, Typography } from 'antd';
import numberToPrice from 'helpers/numberToPrice';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';
import userService from 'services/user';
import WalletTopUp from './top-up';

const SellerWallet = () => {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu);
  const getProfile = useCallback(() => {
    setLoading(true);
    userService
      .profileShow()
      .then((res) => {
        setUser(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeMenu?.refetch) {
      getProfile();
    }
    dispatch(disableRefetch(activeMenu));
  }, [activeMenu?.refetch]);

  const columns = [
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      render: (created_at) => moment(created_at).format('YYYY-MM-DD hh:mm'),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      render: (status) => (
        <div>
          {status === 'paid' ? (
            <Tag color='cyan'>{status}</Tag>
          ) : (
            <Tag color='blue'>{status}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('type'),
      dataIndex: 'type',
      render: (type) =>
        type === 'topup' ? (
          <Tag color='cyan'>{type}</Tag>
        ) : (
          <Tag color='error'>{type}</Tag>
        ),
    },
    {
      title: t('note'),
      dataIndex: 'note',
    },
  ];

  return (
    <Card
      title={t('user.wallet')}
      extra={!loading ? <Button onClick={() => setOpen(true)}>{t('top.up')}</Button> : null}
    >
      {user?.wallet ? (
        <>
          <Typography.Title>
            {numberToPrice(user?.wallet.price)}
          </Typography.Title>
          <Table
            loading={loading}
            dataSource={user?.wallet?.histories}
            columns={columns}
          />
        </>
      ) : (
        <Table dataSource={[]} columns={columns} loading={loading} />
      )}
      <WalletTopUp refetch={getProfile} open={open} handleCancel={() => setOpen(false)}  />
    </Card>
  );
};

export default SellerWallet;
