import { Button, Card, Space, Table, Tabs, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import useDidUpdate from 'helpers/useDidUpdate';
import { fetchBookings } from 'redux/slices/bookings';
import { disableRefetch } from 'redux/slices/menu';
import StatusModal from './status-modal';
import bookingService from 'services/booking';
import SearchInput from 'components/search-input';
import DeleteButton from 'components/delete-button';
import CustomModal from 'components/modal';
import { toast } from 'react-toastify';
import { Context } from 'context/context';
import numberToPrice from 'helpers/numberToPrice';
import moment from 'moment/moment';
import BookingDetailsModal from './details-modal';
import { useQueryParams } from 'helpers/useQueryParams';

const { TabPane } = Tabs;
const bookingTypes = ['all', 'offline_in', 'offline_out', 'online'];

export default function Booking() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { bookings, params, loading, meta } = useSelector(
    (state) => state.bookings,
    shallowEqual,
  );
  const queryParams = useQueryParams();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [paramsData, setParamsData] = useState({
    ...params,
  });
  const [bookingData, setBookingData] = useState(null);
  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('name.client'),
      dataIndex: 'user',
      key: 'name.client',
      is_show: true,
      render: (user) => `${user?.firstname || ''} ${user?.lastname || ''}`,
    },
    {
      title: t('contact'),
      dataIndex: 'master',
      key: 'contact',
      is_show: true,
      render: (master) =>
        master.phone ? (
          <a href={`tel:+${master?.phone}`}> +{master?.phone}</a>
        ) : (
          t('unknown')
        ),
    },
    {
      title: t('service'),
      dataIndex: 'service_master',
      key: 'service',
      is_show: true,
      render: (serviceMaster) => serviceMaster?.service?.translation?.title,
    },
    {
      title: t('start.date'),
      dataIndex: 'start_date',
      key: 'start_date',
      is_show: true,
      render: (startDate) => moment.utc(startDate).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('payment.type'),
      dataIndex: 'transaction',
      key: 'payment.type',
      is_show: true,
      render: (transaction) => <Tag>{t(transaction?.payment_system?.tag)}</Tag>,
    },
    {
      title: t('master'),
      dataIndex: 'master',
      key: 'master',
      is_show: true,
      render: (master) =>
        `${master?.firstname || ''} ${master?.lastname || ''}`,
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
      render: (shop) => `${shop?.translation?.title || '--'}`,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      is_show: false,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status, row) => {
        const result = (color, status) => (
          <div>
            <Tag color={color}>{t(status)}</Tag>
            {status !== 'ended' && status !== 'canceled' && (
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  setBookingData({ status, id: row?.id });
                }}
              />
            )}
          </div>
        );
        switch (status) {
          case 'new':
            return result('blue', status);
          case 'canceled':
            return result('red', status);
          case 'booked':
            return result('yellow', status);
          case 'progress':
            return result('rgba(23,128,184,0.56)', status);
          case 'ended':
            return result('cyan', status);
          default:
            return result('cyan', status);
        }
      },
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price, row) =>
        numberToPrice(price, row?.currency?.symbol, row?.currency?.position),
    },
    {
      title: t('options'),
      key: 'options',
      is_show: true,
      render: (row) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              queryParams.set('bookingId', row?.id);
            }}
          />
          <DeleteButton
            onClick={() => {
              setIsModalVisible(true);
              setId([row?.id]);
            }}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchBookings(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchBookings(paramsData));
  }, [paramsData]);

  const handleFilter = (type, value) => {
    setParamsData((prevParams) => {
      if (value === 'all') {
        const newParams = { ...prevParams };
        delete newParams[type];
        return { ...newParams, page: 1 };
      } else {
        return { ...prevParams, [type]: value, page: 1 };
      }
    });
  };

  const handleDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    bookingService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        setIsModalVisible(false);
        setParamsData((prev) => ({ ...prev, page: 1 }));
      })
      .finally(() => setLoadingBtn(false));
  };

  const onChangePagination = (pagination) => {
    const { pageSize, current } = pagination;
    const params = {
      ...paramsData,
      perPage: pageSize,
      page: current,
    };
    setParamsData((prev) => ({ ...prev, ...params }));
  };

  const handleChangeStatus = (id, params) => {
    return bookingService.changeStatus(id, params).then(() =>
      batch(() => {
        dispatch(fetchBookings(paramsData));
        dispatch(disableRefetch(activeMenu));
      }),
    );
  };

  return (
    <Fragment>
      <Card>
        <Space>
          <SearchInput
            handleChange={(e) => {
              setTimeout(() => {
                handleFilter('search', e);
              }, 500);
            }}
            placeholder={t('search')}
          />
        </Space>
      </Card>
      <Card>
        <Tabs type='card' onChange={(value) => handleFilter('type', value)}>
          {bookingTypes.map((type) => (
            <TabPane tab={t(type)} key={type} />
          ))}
        </Tabs>
        <Table
          columns={columns?.filter((column) => column?.is_show)}
          dataSource={bookings}
          loading={loading}
          scroll={{ x: true }}
          pagination={{
            pageSize: meta?.per_page,
            current: meta?.current_page,
            total: meta?.total,
          }}
          onChange={onChangePagination}
        />
      </Card>
      {bookingData && (
        <StatusModal
          data={bookingData}
          handleClose={() => setBookingData(null)}
          handleSubmit={handleChangeStatus}
        />
      )}
      <CustomModal
        click={handleDelete}
        text={t('are.you.sure')}
        loading={loadingBtn}
      />
      <BookingDetailsModal />
    </Fragment>
  );
}
