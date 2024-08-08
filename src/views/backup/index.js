import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Tooltip, Result } from 'antd';
import { BASE_URL, api_url } from '../../configs/app-global';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CloudDownloadOutlined } from '@ant-design/icons';
import formatSortType from '../../helpers/formatSortType';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import useDidUpdate from '../../helpers/useDidUpdate';
import { fetchBackups } from '../../redux/slices/backup';
import { toast } from 'react-toastify';
import axios from 'axios';
import useDemo from '../../helpers/useDemo';

export default function Backup() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const access_token = localStorage.getItem('token');

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: t('client'),
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div>
          {user.firstname} {user.lastname}
        </div>
      ),
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: t('options'),
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <Tooltip title={t('download.backup')}>
          <Button
            type='primary'
            icon={<CloudDownloadOutlined />}
            onClick={() => downloadBackup('/storage/laravel-backup/' + title)}
          />
        </Tooltip>
      ),
    },
  ];

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { history, meta, loading, params } = useSelector(
    (state) => state.backup,
    shallowEqual
  );
  const data = activeMenu.data;
  const { isDemo } = useDemo();

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { perPage, page, column, sort },
      })
    );
  }

  useDidUpdate(() => {
    if (isDemo) {
      return;
    }
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
    };
    dispatch(fetchBackups(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      if (isDemo) {
        return;
      }
      dispatch(fetchBackups());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const getBackup = () => {
    toast.warning(!isDemo ? t('backup.loading') : null);
    if (isDemo) {
      toast.warning(t('cannot.work.demo'));
      return;
    }
    setLoadingBtn(true);
    axios
      .post(
        `${api_url}dashboard/admin/backup/history`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'content-type': 'text/json',
          },
        }
      )
      .then((res) => downloadBackup(res.data.data.path))
      .finally(() => setLoadingBtn(false));
  };

  function downloadBackup(path) {
    const link = document.createElement('a');
    link.href = BASE_URL + path;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card title={t('backup')}>
      <Result
        status='warning'
        title={t('do.you.care.about.your.data')}
        subTitle={t('here.you.can.take.backup.from.database')}
        extra={
          <Button type='primary' loading={loadingBtn} onClick={getBackup}>
            {t('download.backup')}
          </Button>
        }
      />
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={history}
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
    </Card>
  );
}
