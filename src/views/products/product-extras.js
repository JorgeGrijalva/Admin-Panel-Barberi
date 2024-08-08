import React, { useState } from 'react';
import { Form, Button, Space, Card } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoCloseOutline } from 'react-icons/io5';
import ExtraSelectModal from './extra-select-modal';
import ExtraValueSelectModal from './extra-value-select-modal';

const ProductExtras = ({ next, prev, isRequest }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uuid, id } = useParams();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [extraSelectModalOpen, setExtraSelectModalOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState(
    activeMenu.data?.extras || [],
  );
  const [currentExtra, setCurrentExtra] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const onFinish = () => {
    if (
      selectedExtras.some(
        (selectedExtra) =>
          selectedExtra.values?.length === 0 || !selectedExtra.values,
      )
    ) {
      toast.error(t('please.select.at.least.1.extra.value.for.each.extra'));
      return;
    }
    const extras = selectedExtras.map((selectedExtra) => selectedExtra.value);
    extras.sort((a, b) => a - b);
    if (isRequest) {
      dispatch(
        setMenuData({
          activeMenu,
          data: { ...activeMenu.data, extras: selectedExtras },
        }),
      );
      navigate(`/product-request/${id}?step=2`, {
        state: { generate: isChanged },
      });
      return;
    }
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, extras: selectedExtras },
      }),
    );
    next();
  };

  const handleDeleteSelectedExtra = (extra) => {
    setIsChanged(true);
    setSelectedExtras((oldExtras) =>
      oldExtras.filter((oldExtra) => oldExtra.id !== extra.id),
    );
  };

  const handleSelectExtraValue = (extraId, values) => {
    setIsChanged(true);
    setSelectedExtras((oldExtras) =>
      oldExtras.map((oldExtra) => {
        if (oldExtra.value === extraId) {
          const tempValues = values.map((value) => {
            const prevExtras = activeMenu.data?.extras
              ?.flatMap((extra) => extra.values)
              .find((extra) => extra.value === value.value);
            return { ...value, stock_id: prevExtras?.stock_id };
          });
          return { ...oldExtra, values: tempValues };
        }
        return oldExtra;
      }),
    );
  };

  const handleDeleteSelectedExtraValue = (extraId, value) => {
    setIsChanged(true);
    setSelectedExtras((oldExtras) => {
      return oldExtras.map((oldExtra) => {
        if (oldExtra.value === extraId) {
          return {
            ...oldExtra,
            values:
              oldExtra?.values.filter((oldValue) => oldValue.value !== value) ||
              [],
          };
        }
        return oldExtra;
      });
    });
  };

  return (
    <Card>
      <Form
        layout='vertical'
        initialValues={{ ...activeMenu.data }}
        onFinish={onFinish}
      >
        <ExtraSelectModal
          open={extraSelectModalOpen}
          onClose={() => setExtraSelectModalOpen(false)}
          selectedExtras={selectedExtras}
          onSelect={(item) => {
            setIsChanged(true);
            setSelectedExtras((oldExtras) => [...oldExtras, item]);
            setExtraSelectModalOpen(false);
          }}
        />
        <ExtraValueSelectModal
          extra={currentExtra}
          onClose={() => setCurrentExtra(null)}
          onSelect={handleSelectExtraValue}
        />
        <Space className='w-100' size='middle' direction='vertical'>
          {selectedExtras.map((selectedExtra) => (
            <Space
              key={selectedExtra.id}
              className='w-100'
              direction='vertical'
            >
              <Space className='w-100' wrap>
                <Button
                  onClick={() => setCurrentExtra(selectedExtra)}
                  ghost
                  type='primary'
                >
                  {selectedExtra?.label}
                </Button>
                {selectedExtra?.values?.map((item) => (
                  <div className='extra-value' key={item.value}>
                    {item?.label}{' '}
                    <button
                      onClick={() =>
                        handleDeleteSelectedExtraValue(
                          selectedExtra.value,
                          item.value,
                        )
                      }
                      type='button'
                      className='extra-clear'
                    >
                      <IoCloseOutline />
                    </button>
                  </div>
                ))}
              </Space>
              <Space className='w-100' style={{ justifyContent: 'flex-end' }}>
                <Button
                  danger
                  onClick={() => handleDeleteSelectedExtra(selectedExtra)}
                  type='text'
                >
                  {t('delete')}
                </Button>
              </Space>
            </Space>
          ))}
        </Space>
        <Button
          onClick={() => setExtraSelectModalOpen(true)}
          className='w-100 my-3'
          type='dashed'
        >
          {t('add.extra')}
        </Button>
        <Space className='mt-3'>
          <Button onClick={prev}>{t('prev')}</Button>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('next')}
          </Button>
        </Space>
      </Form>
    </Card>
  );
};
export default ProductExtras;
