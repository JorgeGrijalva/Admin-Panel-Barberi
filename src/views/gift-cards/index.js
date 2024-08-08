import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Context } from 'context/context';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import DeleteButton from 'components/delete-button';
import { fetchGiftCards } from 'redux/slices/gift-cards';
import numberToPrice from 'helpers/numberToPrice';
import CustomModal from 'components/modal';
import GiftCardService from 'services/gift-card';

function GiftCards() {
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
  } = useSelector((state) => state.giftCards, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const [id, setId] = useState(null);
  const [modalText, setModalText] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);

  const goToEdit = (id) => {
    dispatch(
      addMenu({
        id: 'gift_card_edit',
        url: `gift-cards/${id}`,
        name: 'edit.gift.card',
      }),
    );
    clearData();
    navigate(`/gift-cards/${id}`);
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
      render: (price) =>
        numberToPrice(
          price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('time'),
      dataIndex: 'time',
      key: 'time',
      is_show: true,
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
      render: (_, row) => row.shop?.translation?.title,
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
        url: 'gift-cards/add',
        name: 'add.gift.card',
      }),
    );
    clearData();
    navigate('/gift-cards/add');
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

    dispatch(fetchGiftCards(params));
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
    GiftCardService.delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchGiftCards(paramsData));
        setModalText('');
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchGiftCards(paramsData));
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

export default GiftCards;
