import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Space, Row, Col, Image, Tag, Divider, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import orderService from 'services/order';
import { disableRefetch, removeFromMenu, setRefetch } from 'redux/slices/menu';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import Loading from 'components/loading';
import useDidUpdate from 'helpers/useDidUpdate';
import numberToPrice from 'helpers/numberToPrice';
import ProductCards from './product-cards';
import NewProduct from './new-product';
import NoteModal from './note-modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function ReplaceProduct() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order_id, stock_id } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [noteModal, setNoteModal] = useState(false);

  const fetchOrder = () => {
    setLoading(true);
    orderService
      .getById(order_id)
      .then(({ data }) => {
        const products = data?.details?.filter(
          (product) => product?.stock_id === Number(stock_id)
        );
        setData({
          ...products[0],
          delivery_type: data?.delivery_type,
          user: data?.user,
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    fetchOrder();
  }, [order_id]);

  useDidUpdate(() => {
    if (activeMenu.refetch) {
      fetchOrder();
    }
  }, [activeMenu.refetch]);

  const handleSubmit = (values) => {
    const nextUrl = `order/details/${order_id}`;

    const body = {
      products: [
        {
          //old product
          replace_note: values?.note,
          replace_stock_id: data?.stock?.id,
          replace_quantity: data?.quantity,
          //new product
          stock_id: activeMenu.data?.newProduct?.stock?.id,
          quantity: activeMenu.data?.newProduct?.quantity,
        },
      ],

      currency_id: defaultCurrency?.id,
      phone: `${values?.phone}`,
    };

    if (!values?.phone) {
      delete body.phone;
    }

    return orderService.replaceProduct(order_id, body).then(() => {
      setNoteModal(false);
      toast.success(t('successfully.replaced'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(setRefetch(activeMenu));
      });
      navigate(`/${nextUrl}`);
    });
  };

  return (
    <>
      {!loading ? (
        <Card key={`${order_id} ${stock_id}`}>
          <ProductCards />
          <Divider />
          <Card title={t('old.product')} bordered>
            <Row gutter={12}>
              <Col span={4} style={{ width: '100px', height: '250px' }}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    overflow: 'hidden',
                    borderRadius: '15px',
                  }}
                >
                  <img
                    src={data?.stock?.product?.img}
                    placeholder
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </Col>
              <Col span={20}>
                <h4>{data?.stock?.product?.translation?.title}</h4>
                <Space>
                  <p>{t('quantity')}: </p>
                  <p>{data?.quantity}</p>
                </Space>
                <br />
                <Space>
                  <p>{t('price')}: </p>
                  <p>
                    {numberToPrice(data?.stock?.price, defaultCurrency?.symbol)}
                  </p>
                </Space>
                <br />
                <Space wrap>
                  {data?.stock?.extras?.map((extra) => {
                    if (extra?.group?.type === 'color') {
                      return (
                        <span
                          key={extra?.id}
                          style={{
                            display: 'block',
                            width: '30px',
                            height: '30px',
                            backgroundColor: extra?.value?.value,
                            border: '2px solid #909091',
                            borderRadius: '50%',
                          }}
                        />
                      );
                    } else {
                      return <Tag key={extra?.id}>{extra?.value?.value}</Tag>;
                    }
                  })}
                </Space>
              </Col>
            </Row>
          </Card>
          <Divider />
          {activeMenu.data?.newProduct && <NewProduct />}
          <Space wrap>
            <Button
              type={'primary'}
              disabled={!activeMenu.data?.newProduct}
              onClick={() => setNoteModal(true)}
            >
              {t('next')}
            </Button>
          </Space>
        </Card>
      ) : (
        <Loading />
      )}
      {noteModal && (
        <NoteModal
          showModal={noteModal}
          setShowModal={setNoteModal}
          handleSubmit={handleSubmit}
          userData={data?.user}
        />
      )}
    </>
  );
}
