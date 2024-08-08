import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import currencyService from '../../services/currency';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../redux/slices/menu';
import { fetchCurrencies } from '../../redux/slices/currency';
import { useTranslation } from 'react-i18next';
import FilterColumns from '../../components/filter-column';
import DeleteButton from '../../components/delete-button';
import useDidUpdate from '../../helpers/useDidUpdate';

const Currencies = () => {
  const { t } = useTranslation();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { currencies, loading } = useSelector(
    (state) => state.currency,
    shallowEqual
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `currency/${row.id}`,
        id: 'currency_edit',
        name: t('edit.currency'),
      })
    );
    navigate(`/currency/${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      is_show: true,
    },
    {
      title: t('symbol'),
      dataIndex: 'symbol',
      key: 'symbol',
      is_show: true,
    },
    {
      title: t('rate'),
      dataIndex: 'rate',
      key: 'rate',
      is_show: true,
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />

            {row.default ? (
              ''
            ) : (
              <DeleteButton
                icon={<DeleteOutlined />}
                onClick={() => {
                  setId([row.id]);
                  setIsModalVisible(true);
                  setText(true);
                }}
              />
            )}
          </Space>
        );
      },
    },
  ]);

  const deleteCurrency = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    currencyService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchCurrencies());
        setText(null);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      status: data?.role || 'published',
      perPage: data?.perPage,
      page: data?.page,
    };
    dispatch(fetchCurrencies(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    const data = activeMenu.data;
    const params = {
      status: data?.role || 'published',
    };
    if (activeMenu.refetch) {
      dispatch(fetchCurrencies(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

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

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add-currencies',
        url: `currency/add`,
        name: t('add.currency'),
      })
    );
    navigate(`/currency/add`);
  };

  return (
    <Card
      title={t('currencies')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.currency')}
          </Button>
          <DeleteButton onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={currencies}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={false}
      />
      <CustomModal
        click={deleteCurrency}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
    </Card>
  );
};

export default Currencies;
