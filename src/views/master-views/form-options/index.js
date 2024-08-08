import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import React, { useContext, useEffect, useState } from 'react';
import DeleteButton from '../../../components/delete-button';
import formatSortType from '../../../helpers/formatSortType';
import { Context } from '../../../context/context';
import { fetchMasterFormOptions } from '../../../redux/slices/form-options';
import CustomModal from '../../../components/modal';
import { toast } from 'react-toastify';
import masterFormOptionsService from '../../../services/master/form-options';
import useDidUpdate from '../../../helpers/useDidUpdate';

function FormOptions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { formOptions, loading, params, meta } = useSelector(
    (state) => state.formOptions,
    shallowEqual,
  );
  const [text, setText] = useState(null);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const data = activeMenu.data;

  const paramsData = {
    ...data,
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: true,
      key: 'id',
    },
    {
      title: t('form.options.title'),
      is_show: true,
      dataIndex: 'formOptionsTile',
      key: 'formOptionsTile',
      render: (_, row) => row?.translation?.title,
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
        id: 'master-form-options-add',
        url: `master/form-options/add`,
        name: t('add.form.options'),
      }),
    );
    clearData();
    navigate(`/master/form-options/add`);
  };

  const goToEdit = (id) => {
    const url = `master/form-options/${id}`;
    dispatch(
      addMenu({
        id: 'master-form-options-edit',
        url,
        name: t('edit.master.form.options'),
      }),
    );

    navigate('/' + url);
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

    masterFormOptionsService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        setIsModalVisible(false);
        setText('');
        dispatch(fetchMasterFormOptions());
      })
      .finally(() => setLoadingBtn(false));
  };

  const deleteSelected = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText('all.delete');
    }
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu));
      dispatch(fetchMasterFormOptions());
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchMasterFormOptions(paramsData));
  }, [activeMenu.data]);

  return (
    <>
      <Card
        extra={
          <Space>
            <Button onClick={deleteSelected} icon={<DeleteOutlined />}>
              {t('delete.selected')}
            </Button>
            <Button type='primary' onClick={goToAdd}>
              <PlusCircleOutlined /> {t('add.form.options')}
            </Button>
          </Space>
        }
        title={t('form.options')}
      >
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={formOptions}
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

export default FormOptions;
