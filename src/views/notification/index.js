import React, { useContext, useEffect, useState } from 'react';
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Table, Tag, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import CustomModal from '../../components/modal';
import { Context } from '../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import { fetchNotifications } from '../../redux/slices/notification';
import useDidUpdate from '../../helpers/useDidUpdate';
import formatSortType from '../../helpers/formatSortType';
import blogService from '../../services/blog';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../components/delete-button';
import FilterColumns from '../../components/filter-column';
import moment from 'moment';

export default function Notifications() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `notification/${row.uuid}`,
        id: 'notification_edit',
        name: t('edit.notification'),
      }),
    );
    navigate(`/notification/${row.uuid}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        id: `notification-clone`,
        url: `notification-clone/${row.uuid}`,
        name: t('notification.clone'),
      }),
    );
    navigate(`/notification-clone/${row.uuid}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'translation',
      key: 'translation',
      is_show: true,
      render: (translation) => translation?.title,
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format('YYYY-MM-DD'),
    },
    {
      title: t('published.at'),
      dataIndex: 'published_at',
      key: 'published_at',
      is_show: true,
      render: (published_at) => (
        <>
          {published_at ? (
            <Tag color='red'>{moment(published_at).format('YYYY-MM-DD')}</Tag>
          ) : (
            <Tag color='blue'>{t('not.published')}</Tag>
          )}
        </>
      ),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        console.log('row', row);
        return (
          <Space>
            {!row.published_at ? (
              <Space>
                <Tooltip title={t('publish')}>
                  <Button
                    disabled={!row.active}
                    icon={<CloudUploadOutlined />}
                    onClick={() => {
                      setId(row.uuid);
                      setIsDelete(false);
                      setIsPublish(true);
                      setIsModalVisible(true);
                    }}
                  />
                </Tooltip>
                <Button
                  type='primary'
                  icon={<EditOutlined />}
                  onClick={() => goToEdit(row)}
                />
              </Space>
            ) : (
              ''
            )}
            <Button icon={<CopyOutlined />} onClick={() => goToClone(row)} />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsDelete(true);
                setIsModalVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [isDelete, setIsDelete] = useState(null);
  const [isPublish, setIsPublish] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('published');
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu.data;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    status: immutable ? undefined : immutable,
  };

  const { notifications, meta, loading, params } = useSelector(
    (state) => state.notification,
    shallowEqual,
  );

  const notificationDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    blogService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchNotifications());
        setIsModalVisible(false);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  const notificationPublish = () => {
    setLoadingBtn(true);
    blogService
      .publish(id)
      .then(() => {
        toast.success(t('successfully.published'));
        dispatch(fetchNotifications());
        setIsModalVisible(false);
        setIsPublish(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  const notificationSetActive = () => {
    setLoadingBtn(true);
    blogService
      .setActive(id)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(fetchNotifications());
        setIsModalVisible(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchNotifications(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchNotifications(paramsData));
  }, [activeMenu.data]);

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
      setIsDelete(true);
    }
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add.notification',
        url: `notification/add`,
        name: t('add.notification'),
      }),
    );
    navigate(`/notification/add`);
  };

  return (
    <Card
      title={t('notifications')}
      extra={
        <Space>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.notification')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={notifications}
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
      <CustomModal
        click={
          isPublish
            ? notificationPublish
            : isDelete
            ? notificationDelete
            : notificationSetActive
        }
        text={
          isPublish
            ? t('publish.notification')
            : isDelete
            ? t('delete.notification')
            : t('set.active.notification')
        }
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
}
