import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import React, { useContext, useEffect, useState } from 'react';
import { fetchSellerGiftCards } from '../../../redux/slices/gift-cards';
import DeleteButton from '../../../components/delete-button';
import numberToPrice from '../../../helpers/numberToPrice';
import { sellerFetchLooks } from '../../../redux/slices/looks';
import CustomModal from '../../../components/modal';
import { toast } from 'react-toastify';
import orderService from '../../../services/order';
import { fetchUserOrders } from '../../../redux/slices/orders';
import SellerGiftCardService from '../../../services/seller/gift-cards';
import { Context } from '../../../context/context';

function SellerGiftCards() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    giftCards,
    loading,
    meta,
    params: paramsData,
  } = useSelector((state) => state.giftCards);

  const [id, setId] = useState(null);
  const [modalText, setModalText] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);

  const goToEdit = (id) => {
    dispatch(
      addMenu({
        id: 'gift_card_edit',
        url: `seller/gift-cards/${id}`,
        name: 'edit.gift.card',
      }),
    );
    clearData();
    navigate(`/seller/gift-cards/${id}`);
  };

  const [columns] = useState([
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
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price) => numberToPrice(price),
    },
    {
      title: t('time'),
      dataIndex: 'time',
      key: 'time',
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
                setId([record.id]);
                setIsModalVisible(true);
                setModalText('delete');
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const clearData = () => {
    dispatch(setMenuData({ activeMenu, data: null }));
  };

  const goToCreate = () => {
    dispatch(
      addMenu({
        id: 'add_gift_card',
        url: 'seller/gift-cards/add',
        name: 'add.gift.card',
      }),
    );
    clearData();
    navigate('/seller/gift-cards/add');
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;

    const params = {
      ...paramsData,
      perPage: pageSize,
      page: current,
    };

    dispatch(fetchSellerGiftCards(params));
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setModalText('all.delete');
    }
  };

  const giftCardDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    SellerGiftCardService.delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchSellerGiftCards(params));
        setModalText('');
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerGiftCards(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('gift.cards')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToCreate}
            key={1}
          >
            {t('add.gift.card')}
          </Button>
          <DeleteButton onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowKey={(record) => record.id}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={giftCards}
        loading={loading}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        onChange={onChangePagination}
      />
      <CustomModal
        click={giftCardDelete}
        text={modalText}
        loading={loadingBtn}
        setText={setModalText}
      />
    </Card>
  );
}

export default SellerGiftCards;
