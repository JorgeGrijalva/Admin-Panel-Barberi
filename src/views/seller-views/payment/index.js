import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CustomModal from '../../../components/modal';
import { toast } from 'react-toastify';
import { Context } from '../../../context/context';
import { fetchSellerPayments } from '../../../redux/slices/payment';
import paymentService from '../../../services/seller/payment';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';

export default function SellerPayment() {
  const { t } = useTranslation();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const navigate = useNavigate();
  const [text, setText] = useState(null);
  const { payments, loading } = useSelector(
    (state) => state.payment,
    shallowEqual
  );
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('title'),
      is_show: true,
      dataIndex: 'title',
      key: 'title',
      render: (title, row) => {
        return <>{row.payment?.tag}</>;
      },
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      dataIndex: 'options',
      render: (data, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
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

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/payments/${row.id}`,
        id: 'payments_edit',
        name: t('edit.payments'),
      })
    );
    navigate(`/seller/payments/${row.id}`);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerPayments());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchSellerPayments({ perPage: pageSize, page: current }));
  };

  const paymentDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    paymentService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerPayments());
        setIsModalVisible(false);
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setId(newSelectedRowKeys);
  };

  const rowSelection = {
    id,
    onChange: onSelectChange,
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add.payment',
        url: 'seller/payments/add',
        name: t('add.payment'),
      })
    );
    navigate('/seller/payments/add');
  };

  return (
    <Card
      title={t('payment')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.payment')}
          </Button>
          <DeleteButton className='' type='danger' onClick={allDelete}>
            {t('delete.all')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={payments}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />
      <CustomModal
        click={paymentDelete}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
}
