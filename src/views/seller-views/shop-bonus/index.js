import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Switch, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { fetchShopBonus } from '../../../redux/slices/shop-bonus';
import moment from 'moment';
import shopBonusService from '../../../services/seller/shopBonus';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';

const ShopBonus = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [type, setType] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { shopBonus, meta, loading } = useSelector(
    (state) => state.shopBonus,
    shallowEqual
  );

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('order.amount'),
      dataIndex: 'value',
      key: 'value',
      is_show: true,
    },
    {
      title: t('bonus.product'),
      dataIndex: 'bonusStock',
      key: 'bonusStock',
      is_show: true,
      render: (bonusStock, row) => {
        return row.bonusStock?.product?.translation.title;
      },
    },
    {
      title: t('active'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status, row) => {
        return (
          <Switch
            key={row.id + status}
            onChange={() => {
              setIsModalVisible(true);
              setActiveId(row.id);
              setType(true);
            }}
            checked={status}
          />
        );
      },
    },
    {
      title: t('expired.at'),
      dataIndex: 'expired_at',
      key: 'expired_at',
      is_show: true,
      render: (expired_at) => (
        <div>
          {moment(new Date()).isBefore(expired_at) ? (
            <Tag color='blue'>{expired_at}</Tag>
          ) : (
            <Tag color='error'>{expired_at}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (data, row) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => goToEdit(row)}
          />
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId([row.id]);
              setType(false);
              setText(true);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/shop-bonus/${row.id}`,
        id: 'bonus_edit',
        name: t('edit.bonus'),
      })
    );
    navigate(`/seller/shop-bonus/${row.id}`);
  };

  const bannerDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    shopBonusService
      .delete(params)
      .then(() => {
        dispatch(fetchShopBonus());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  const handleActive = () => {
    setLoadingBtn(true);
    shopBonusService
      .setActive(activeId)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchShopBonus());
        toast.success(t('successfully.updated'));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchShopBonus());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchShopBonus({ perPage: pageSize, page: current }));
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
        id: 'add.bonus',
        url: `seller/shop-bonus/add`,
        name: t('add.bonus'),
      })
    );
    navigate(`/seller/shop-bonus/add`);
  };

  return (
    <Card
      title={t('bonus')}
      extra={
        <Space wrap>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.bonus')}
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
        dataSource={shopBonus}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={type ? handleActive : bannerDelete}
        text={
          type ? t('set.active.bonus') : text ? t('delete') : t('all.delete')
        }
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default ShopBonus;
