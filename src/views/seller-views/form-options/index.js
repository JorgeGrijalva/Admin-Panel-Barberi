import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Context } from '../../../context/context';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import CustomModal from '../../../components/modal';
import DeleteButton from '../../../components/delete-button';
import { fetchSellerFormOptions } from '../../../redux/slices/form-options';
import sellerFormOptionService from '../../../services/seller/form-option';

function FormOptions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { setIsModalVisible } = useContext(Context);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { formOptions, loading, meta, params } = useSelector(
    (state) => state.formOptions,
    shallowEqual,
  );

  const [id, setId] = useState(null);
  const [active, setActive] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      is_show: true,
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, record) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(record?.id)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setId([record.id]);
                setActive(false);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const goToCreate = () => {
    dispatch(
      addMenu({
        id: 'seller/add-form-options',
        url: 'seller/form-options/add',
        name: 'add.form.option',
      }),
    );
    clearData();
    navigate('/seller/form-options/add');
  };

  const goToEdit = (id) => {
    dispatch(
      addMenu({
        id: 'seller/form_options-edit',
        url: `seller/form-options/${id}`,
        name: 'seller.edit.form.options',
      }),
    );
    clearData();
    navigate(`${id}`);
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;

    const paramsData = {
      ...params,
      perPage: pageSize,
      page: current,
    };

    dispatch(fetchSellerFormOptions(paramsData));
  };

  const handleDeleteFormOptions = () => {
    setLoadingBtn(true);

    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    sellerFormOptionService
      .delete(params)
      .then(() => {
        dispatch(fetchSellerFormOptions({ params }));
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        setActive(false);
        setId(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const deleteSelected = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
    }
  };

  const clearData = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: null,
      }),
    );
  };

  const handleActive = () => {
    // setLoadingBtn(true);
    // looksService
    //   .setActive(id)
    //   .then(() => {
    //     dispatch(fetchLooks({ paramsData }));
    //     toast.success(t('successfully.updated'));
    //     setIsModalVisible(false);
    //     setActive(false);
    //     setId(null);
    //   })
    //   .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu));
      dispatch(fetchSellerFormOptions());
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('form.options')}
      extra={
        <Space>
          <DeleteButton icon={<DeleteOutlined />} onClick={deleteSelected}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToCreate}
          >
            {t('add.form.option')}
          </Button>
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowKey={(record) => record.id}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={formOptions}
        loading={loading}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        onChange={onChangePagination}
      />
      <CustomModal
        click={active ? handleActive : handleDeleteFormOptions}
        text={
          active
            ? t('set.active')
            : t('are.you.sure.you.want.to.delete.the.selected.products')
        }
        loading={loadingBtn}
        setActive={setActive}
      />
    </Card>
  );
}

export default FormOptions;
