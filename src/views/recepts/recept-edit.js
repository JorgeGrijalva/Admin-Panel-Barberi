import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Form, Spin, Steps } from 'antd';
import { IMG_URL } from '../../configs/app-global';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import LanguageList from '../../components/language-list';
import { steps } from './steps';
import recieptService from '../../services/reciept';

const { Step } = Steps;

const RecieptEdit = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const [current, setCurrent] = useState(activeMenu.data?.step || 0);
  const createImage = (name) => {
    return {
      name,
      url: IMG_URL + name,
    };
  };
  const [image, setImage] = useState(
    activeMenu.data?.galleries[0]
      ? [createImage(activeMenu.data.galleries[0].path)]
      : []
  );
  const [back, setBack] = useState(
    activeMenu.data?.galleries[1]
      ? [createImage(activeMenu.data.galleries[1].path)]
      : []
  );
  const next = () => {
    const step = current + 1;
    setCurrent(step);
  };

  const prev = () => {
    const step = current - 1;
    setCurrent(step);
  };
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const fetchBox = (id) => {
    setLoading(true);
    recieptService
      .getById(id)
      .then((res) => {
        let recept = res.data;
        form.setFieldsValue({
          ...recept,
          title: {
            [defaultLang]: recept.translation.title,
          },
          description: {
            [defaultLang]: recept.translation.description,
          },
          instruction: Object.assign(
            {},
            ...recept.instructions.map((ins) => ({
              [ins.locale]: ins.title,
            }))
          ),
          ingredient: Object.assign(
            {},
            ...recept.ingredients.map((ing) => ({
              [ing.locale]: ing.title,
            }))
          ),
          nutrition: recept.nutritions?.map((nutrition) => ({
            percentage: nutrition?.percentage?.toString(),
            weight: nutrition.weight,
            ...Object.assign(
              {},
              ...nutrition.translations.flatMap((translation) => ({
                [translation.locale]: translation.title,
              }))
            ),
          })),
          category_id: {
            value: recept.category.id,
            label: recept.category.translation?.title,
          },
          shop_id: {
            value: recept.shop.id,
            label: recept.shop.translation?.title,
          },
          stocks: recept.stocks.map((item) => ({
            stock_id: {
              value: item.id,
              label: item?.product?.translation?.title,
            },
            ...item,
          })),
        });
        setImage([createImage(recept.galleries[0].path)]);
        setBack([createImage(recept.galleries[1].path)]);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const images = [...image, ...back];

  const onFinish = (values) => {
    form.validateFields();
    const body = {
      ...values,
      category_id: values.category_id.value,
      images: images.map((img) => img.name),
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
      .update(id, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        navigate(`/${nextUrl}`);
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchBox(id);
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={t('edit.recepe')} extra={<LanguageList />}>
      {!loading ? (
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
      ) : (
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      )}
    </Card>
  );
};

export default RecieptEdit;
