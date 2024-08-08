import React, { Fragment, useEffect, useState } from 'react';
import { Button, Card, Image, Space, Table, Tabs, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import useDidUpdate from 'helpers/useDidUpdate';
import { useSelector, useDispatch, shallowEqual, batch } from 'react-redux';
import { fetchSellerDeliverymans } from 'redux/slices/deliveryman';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import useDemo from 'helpers/useDemo';
import hideEmail from 'components/hideEmail';
import { IMG_URL } from 'configs/app-global';
import { EditOutlined } from '@ant-design/icons';
import SearchInput from 'components/search-input';
import DeliverymenStatusModal from './status-change-modal';
import { useNavigate } from 'react-router-dom';
import hideNumber from 'components/hideNumber';
import { statuses } from './statuses';

const { TabPane } = Tabs;

const roles = ['all', ...statuses.map((item) => item.label)];

const ReactAppIsDemo = process.env.REACT_APP_IS_DEMO;

function SellerDeliverymen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isDemo } = useDemo();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { deliverymans, params, loading, meta } = useSelector(
    (state) => state.deliveryman,
    shallowEqual,
  );
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

  // const [id, setId] = useState(null);
  const [statusChange, setStatusChange] = useState(null);
  const [role, setRole] = useState(activeMenu.data?.role || roles[0]);

  const paramsData = {
    search: activeMenu?.data?.search ?? null,
    invite_status: role !== 'all' ? role : null,
    ...params,
  };

  if (!paramsData?.search?.length) delete paramsData?.search;

  const columns = [
    { title: t('id'), is_show: true, dataIndex: 'id', key: 'id' },
    {
      title: t('image'),
      dataIndex: 'img',
      is_show: true,
      render: (img) => {
        return (
          <Image
            width={100}
            src={IMG_URL + img}
            placeholder
            style={{ borderRadius: 4 }}
          />
        );
      },
    },
    {
      title: t('fullname'),
      dataIndex: 'full_name',
      key: 'full_name',
      is_show: true,
      render: (_, row) => (row?.firstname || '') + ' ' + (row?.lastname || ''),
    },
    {
      title: t('phone'),
      dataIndex: 'phone',
      is_show: true,
      render: (phone) =>
        phone ? (
          isDemo || ReactAppIsDemo === 'true' ? (
            <a href={`tel:${phone}`}>{hideNumber(phone)}</a>
          ) : (
            <a href={`tel:${phone}`}>{phone}</a>
          )
        ) : (
          '--'
        ),
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      is_show: true,
      render: (email) =>
        isDemo || ReactAppIsDemo === 'true' ? (
          <a href={`mailto:${email}`}>{hideEmail(email)}</a>
        ) : (
          <a href={`mailto:${email}`}>{email}</a>
        ),
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      is_show: true,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (_, row) => {
        const invite = row?.invitations?.filter(
          (item) => item?.shop_id === myShop?.id,
        )?.[0];

        return (
          <div>
            {invite?.status === 'new' ? (
              <Tag color='blue'>{t(invite?.status)}</Tag>
            ) : invite?.status === 'rejected' ||
              invite?.status === 'canceled' ? (
              <Tag color='error'>{t(invite?.status)}</Tag>
            ) : (
              <Tag color='cyan'>{t(invite?.status)}</Tag>
            )}
            {myShop?.delivery_type === 2 && (
              <EditOutlined
                onClick={() => setStatusChange({ ...row, invite })}
              />
            )}
          </div>
        );
      },
    },
    {
      title: t('options'),
      dataIndex: 'options',
      key: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row?.uuid)}
            />
          </Space>
        );
      },
    },
  ];

  useDidUpdate(() => {
    dispatch(fetchSellerDeliverymans(paramsData));
  }, [activeMenu.data?.search, role]);

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchSellerDeliverymans(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  const onChangePagination = ({ pageSize, current }) => {
    const params = {
      ...paramsData,
      perPage: pageSize,
      page: current,
    };

    dispatch(fetchSellerDeliverymans(params));
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'seller-invitations-deliverymen-add',
        url: `seller/invitations/deliverymen/add`,
        name: t('add.deliveryman'),
      }),
    );
    navigate('add', { state: { paramsData } });
  };

  const goToEdit = (uuid) => {
    dispatch(
      addMenu({
        id: 'seller-deliveryman-edit',
        url: `seller/invitations/deliverymen/edit/${uuid}`,
        name: t('edit.deliveryman'),
      }),
    );
    navigate(`/seller/invitations/deliverymen/edit/${uuid}`, {
      state: { paramsData },
    });
  };

  return (
    <Fragment>
      <Card>
        <Space wrap size={[14, 20]}>
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
          />
        </Space>
        {myShop?.delivery_type === 2 && (
          <Button style={{ float: 'right' }} type='primary' onClick={goToAdd}>
            {t('add.deliveryman')}
          </Button>
        )}
      </Card>
      <Card>
        <Tabs
          className='mt-3'
          activeKey={role}
          onChange={(key) => {
            handleFilter({ role: key, page: 1 });
            setRole(key);
          }}
          type='card'
        >
          {roles.map((item) => (
            <TabPane tab={t(item)} key={item} />
          ))}
        </Tabs>
        <Table
          loading={loading}
          dataSource={deliverymans || []}
          columns={columns?.filter((item) => item?.is_show)}
          scroll={{ x: true }}
          rowKey={(row) => row.id}
          pagination={{
            pageSize: meta?.per_page,
            page: meta?.current_page,
            total: meta?.total,
            current: meta?.current_page,
          }}
          onChange={onChangePagination}
        />
      </Card>
      {statusChange && (
        <DeliverymenStatusModal
          data={statusChange}
          handleCancel={() => setStatusChange(null)}
          paramsData={paramsData}
        />
      )}
    </Fragment>
  );
}

export default SellerDeliverymen;
