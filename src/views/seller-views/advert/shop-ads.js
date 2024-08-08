import React, { useEffect, useState } from 'react';
import { Button, Table, Card, Space, Tag } from 'antd';
import { fetchShopAdverts } from 'redux/slices/advert';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SearchInput from 'components/search-input';
import FilterColumns from 'components/filter-column';
import { disableRefetch } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import numberToPrice from 'helpers/numberToPrice';
import advertService from 'services/seller/advert';
import { toast } from 'react-toastify';
import paymentService from 'services/rest/payment';
import { EyeFilled } from '@ant-design/icons';
import AdDetail from './ad-detail';
import moment from 'moment';
import AdPurchaseModal from './ad-purchase-modal';

export default function Advert() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [buyingAd, setBuyingAd] = useState(null);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    shopAdList,
    loading: listLoading,
    meta,
  } = useSelector((state) => state.advert, shallowEqual);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = (id) => {
    setLoading(true);
    paymentService
      .getAll()
      .then((res) => {
        const wallet = res.data.find((payment) => payment.tag === 'wallet');
        if (!wallet) {
          toast.error(t('request.admin.to.enable.payment.from.wallet'));
          setLoading(false);
          return;
        }
        advertService
          .purchase(id, { payment_sys_id: wallet?.id })
          .then(() => {
            toast.success(t('purchased.successfully'));
          })
          .finally(() => {
            setLoading(false);
            dispatch(fetchShopAdverts(paramsData));
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('ad.package'),
      dataIndex: 'ads_package',
      is_show: true,
      render: (ad) => {
        return (
          <Space>
            <span>{ad?.translation?.title}</span>
            <Button icon={<EyeFilled />} onClick={() => setId(ad.id)} />
          </Space>
        );
      },
    },
    {
      title: t('price'),
      dataIndex: 'price',
      is_show: true,
      render: (_, row) => numberToPrice(row?.ads_package?.price),
    },
    {
      title: t('expire_at'),
      dataIndex: 'expire_at',
      is_show: true,
      render: (_, row) => moment(row?.expired_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      is_show: true,
      render: (status) => (
        <div>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'canceled' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('transaction'),
      dataIndex: 'transaction',
      is_show: true,
      render: (transaction) => {
        return (
          <div>
            {transaction?.status === 'paid' ? (
              <Tag color='cyan'>{t(transaction?.status)}</Tag>
            ) : transaction?.status === 'canceled' ||
              transaction?.status === 'rejected' ? (
              <Tag color='error'>{t(transaction?.status)}</Tag>
            ) : (
              <Tag color='orange'>{t('not.paid')}</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              onClick={() => {
                setBuyingAd(row);
              }}
              disabled={row.transaction?.status === 'paid'}
              loading={loading}
            >
              {t('purchase')}
            </Button>
          </Space>
        );
      },
    },
  ]);

  const paramsData = {
    perPage: 10,
    page: 1,
    sort: 'desc',
    column: 'created_at',
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchShopAdverts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const paramsData = {
      search,
    };
    dispatch(fetchShopAdverts(paramsData));
  }, [activeMenu.data, search]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchShopAdverts({ perPage: pageSize, page: current }));
  };

  return (
    <>
      <Card className='p-o'>
        <div className='flex justify-content-between'>
          <SearchInput
            style={{ maxWidth: '200px' }}
            handleChange={(value) => setSearch(value)}
            placeholder={t('search')}
          />
          <div className='flex gap-3'>
            <FilterColumns columns={columns} setColumns={setColumns} />
          </div>
        </div>
      </Card>
      <Card>
        <Table
          scroll={{ x: true }}
          dataSource={shopAdList}
          columns={columns?.filter((item) => item.is_show)}
          rowKey={(record) => record.id}
          loading={listLoading || loading}
          pagination={{
            pageSize: meta.per_page,
            page: meta.current_page,
            total: meta.total,
          }}
          onChange={onChangePagination}
        />
      </Card>
      <AdDetail id={id} onClose={() => setId(null)} />
      {buyingAd && (
        <AdPurchaseModal
          buyingAd={buyingAd}
          handleCancel={() => setBuyingAd(null)}
        />
      )}
    </>
  );
}
