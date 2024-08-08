import React, { useEffect, useState, useContext } from 'react';
import { Button, Space, Table, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, setMenuData } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import numberToPrice from '../../helpers/numberToPrice';
import { fetchUserOrders } from '../../redux/slices/orders';
import formatSortType from '../../helpers/formatSortType';
import { Context } from '../../context/context';
import { toast } from 'react-toastify';
import DeleteButton from '../../components/delete-button';
import CustomModal from '../../components/modal';
import orderService from '../../services/order';
import FilterColumns from '../../components/filter-column';

export default function UserOrders({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { orders, meta, loading, params } = useSelector(
    (state) => state.orders,
    shallowEqual
  );

  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );

  const orderDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    orderService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchUserOrders());
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      })
    );
    navigate(`/order/details/${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: t('client'),
      is_show: true,
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div>
          {user?.firstname} {user?.lastname || ''}
        </div>
      ),
    },
    {
      title: t('number.of.products'),
      is_show: true,
      dataIndex: 'order_details_count',
      key: 'order_details_count',
      render: (order_details_count) => (
        <div className='text-lowercase'>
          {order_details_count || 0} {t('products')}
        </div>
      ),
    },
    {
      title: t('amount'),
      is_show: true,
      dataIndex: 'total_price',
      key: 'total_price',
      render: (total_price) =>
        numberToPrice(total_price, defaultCurrency?.symbol),
    },
    {
      title: t('payment.type'),
      is_show: true,
      dataIndex: 'transaction',
      key: 'transaction',
      render: (transaction) => t(transaction?.payment_system?.tag) || '-',
    },
    {
      title: t('created.at'),
      is_show: true,
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      render: (_, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  useEffect(() => {
    const params = {
      user_id: data?.uuid,
      page: 1,
      perPage: 10,
    };
    dispatch(fetchUserOrders(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  return (
    <div>
      <Card
        title={t('orders')}
        extra={
          <Space wrap>
            <DeleteButton type='danger' onClick={allDelete}>
              {t('delete.all')}
            </DeleteButton>
            <FilterColumns setColumns={setColumns} columns={columns} />
          </Space>
        }
      >
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((items) => items.is_show)}
          dataSource={orders}
          loading={loading}
          pagination={{
            pageSize: params.perPage,
            page: params.page,
            total: meta.total,
            defaultCurrent: params.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
        />
        <CustomModal
          click={orderDelete}
          text={text ? t('delete') : t('all.delete')}
          loading={loadingBtn}
          setText={setId}
        />
      </Card>
    </div>
  );
}
