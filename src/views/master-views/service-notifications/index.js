import { Button, Card, Space, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '../../../components/delete-button';
import { fetchMasterServiceNotifications } from '../../../redux/slices/service-notifications';
import { Context } from '../../../context/context';
import formatSortType from '../../../helpers/formatSortType';
import { toast } from 'react-toastify';
import CustomModal from '../../../components/modal';
import serviceNotificationsService from '../../../services/master/serviceNotifications';

function ServiceNotifications() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { serviceNotifications, loading, params, meta } = useSelector(
    (state) => state.serviceNotifications,
    shallowEqual,
  );

  const [text, setText] = useState(null);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: true,
      key: 'id',
    },
    {
      title: t('service.master.id'),
      is_show: true,
      dataIndex: 'service_master_id',
      key: 'service_master_id',
    },
    {
      title: t('last.sent.at'),
      is_show: true,
      dataIndex: 'last_sent_at',
      key: 'last_sent_at',
    },
    {
      title: t('notification.time'),
      is_show: true,
      dataIndex: 'notification_time',
      key: 'notification_time',
      render: (notification_time, row) =>
        `${notification_time} ${row.notification_type}`,
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
              onClick={() => {
                goToEdit(row.id);
              }}
            />

            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText('delete');
              }}
            />
          </Space>
        );
      },
    },
  ];

  const deleteSelected = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText('all.delete');
    }
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

    serviceNotificationsService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        setIsModalVisible(false);
        setText('');
        dispatch(fetchMasterServiceNotifications());
      })
      .finally(() => setLoadingBtn(false));
  };

  const goToEdit = (id) => {
    const url = `master/service-notifications/${id}`;
    dispatch(
      addMenu({
        id: 'master-service-notifications-edit',
        url,
        name: t('edit.service.notifications'),
      }),
    );

    navigate('/' + url);
  };

  const clearData = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: null,
      }),
    );
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'master-service-notifications-add',
        url: `master/service-notifications/add`,
        name: t('add.service.notifications'),
      }),
    );
    clearData();
    navigate(`/master/service-notifications/add`);
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchMasterServiceNotifications());
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  return (
    <>
      <Card
        title={t('service.notifications')}
        extra={
          <Space>
            <Button onClick={deleteSelected} icon={<DeleteOutlined />}>
              {t('delete.selected')}
            </Button>
            <Button type='primary' onClick={goToAdd}>
              <PlusCircleOutlined /> {t('add.service.notification')}
            </Button>
          </Space>
        }
      >
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={serviceNotifications}
          loading={loading}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
        />
      </Card>
      <CustomModal
        click={handleDelete}
        text={text}
        setText={setId}
        loading={loadingBtn}
      />
    </>
  );
}

export default ServiceNotifications;
