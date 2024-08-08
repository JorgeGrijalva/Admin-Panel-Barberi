import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Form, Steps } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';

import { useTranslation } from 'react-i18next';
import LanguageList from '../../components/language-list';
import { steps } from './steps';
import recieptService from '../../services/reciept';
import { IMG_URL } from 'configs/app-global';

const { Step } = Steps;

const ReceptAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const createImage = (name) => {
    return {
      name,
      url: IMG_URL + name,
    };
  };
  const [image, setImage] = useState(
    activeMenu.data?.galleries?.[0]
      ? [createImage(activeMenu.data?.galleries?.[0].path)]
      : []
  );
  const [back, setBack] = useState(
    activeMenu.data?.galleries?.[1]
      ? [createImage(activeMenu.data?.galleries?.[1].path)]
      : []
  );
  const images = [...image, ...back];

  const [current, setCurrent] = useState(activeMenu.data?.step || 0);

  const next = () => {
    const step = current + 1;
    setCurrent(step);
  };

  const prev = () => {
    const step = current - 1;
    setCurrent(step);
  };
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    form.validateFields();
    const body = {
      ...values,
      images: images.map((img) => img.name),
      category_id: values.category_id.value,
      shop_id: values.shop_id.value,
      active_time: values.active_time.toString(),
      total_time: values.total_time.toString(),
      nutrition: values.nutrition.map((item) => ({
        ...item,
        percentage: String(item.percentage),
        weight: String(item.weight),
      })),
      stocks: values.stocks?.map((stock) => ({
        min_quantity: stock.min_quantity,
        stock_id: stock.stock_id.value,
      })),
    };
    setLoadingBtn(true);
    const nextUrl = 'catalog/recept';
    recieptService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        navigate(`/${nextUrl}`);
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card title={t('add.recepe')} extra={<LanguageList />}>
      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ active: true, ...activeMenu.data }}
      >
        <Steps current={current}>
          {steps.map((item) => (
            <Step title={t(item.title)} key={item.title} />
          ))}
        </Steps>
        {steps.map((item) => {
          const Component = item.content;
          return (
            <div
              key={item.title}
              className={`steps-content ${
                item.step !== current + 1 && 'hidden'
              }`}
            >
              <Component
                next={next}
                prev={prev}
                loading={loadingBtn}
                image={image}
                setImage={setImage}
                back={back}
                setBack={setBack}
              />
            </div>
          );
        })}
      </Form>
    </Card>
  );
};

export default ReceptAdd;
