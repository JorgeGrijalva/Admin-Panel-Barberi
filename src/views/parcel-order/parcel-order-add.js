import React, { useEffect, useState } from 'react';
import { Card, Form, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { batch, shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { steps } from './steps';
import ParcelSender from './parcel-sender';
import ParcelReceiver from './parcel-receiver';
import ParcelDetails from './parcel-details';
import { useQueryParams } from 'helpers/useQueryParams';
import { useDispatch } from 'react-redux';
import { removeFromMenu, setMenuData } from 'redux/slices/menu';
import getDefaultLocation from 'helpers/getDefaultLocation';
import moment from 'moment';
import parcelOrderService from 'services/parcelOrder';
import { fetchParcelOrders } from 'redux/slices/parcelOrders';
import { toast } from 'react-toastify';

const { Step } = Steps;

export default function ParcelOrderAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const current = Number(queryParams.values?.step || 0);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [image, setImage] = useState(activeMenu?.data?.images || []);
  const [locationFrom, setLocationFrom] = useState(
    activeMenu?.data?.location_from
      ? {
          lat: parseFloat(activeMenu?.data?.location_from?.latitude),
          lng: parseFloat(activeMenu?.data?.location_from?.longitude),
        }
      : getDefaultLocation(settings),
  );
  const [locationTo, setLocationTo] = useState(
    activeMenu?.data?.location_to
      ? {
          lat: parseFloat(activeMenu?.data?.location_to?.latitude),
          lng: parseFloat(activeMenu?.data?.location_to?.longitude),
        }
      : getDefaultLocation(settings),
  );

  useEffect(() => {
    return () => {
      const values = form.getFieldsValue(true);
      const date = JSON.stringify(values.delivery_date);
      const time = JSON.stringify(values.delivery_time);
      const data = { ...values, date, time };
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const next = () => {
    const step = current + 1;
    queryParams.set('step', step);
  };
  const prev = () => {
    const step = current - 1;
    queryParams.set('step', step);
  };

  const onChange = (step) => {
    queryParams.set('step', step);
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const payload = {
      user_id: values.user_from?.value,
      currency_id: defaultCurrency?.id,
      type_id: values.type?.value,
      rate: defaultCurrency?.rate,
      phone_from: values.phone_from.toString(),
      username_from: values.username_from,
      address_from: {
        longitude: locationFrom?.lng,
        latitude: locationFrom?.lat,
        address: values.address_from,
        house: values.house_from,
        stage: values.stage_from,
        room: values.room_from,
      },
      phone_to: values.phone_to.toString(),
      username_to: values.username_to,
      address_to: {
        longitude: locationTo?.lng,
        latitude: locationTo?.lat,
        address: values.address_to,
        house: values.house_to,
        stage: values.stage_to,
        room: values.room_to,
      },
      delivery_date: moment(values.delivery_date).format('YYYY-MM-DD HH:mm'),
      note: values.note,
      images: image.map((item) => item.name),
      payment_id: values.payment_type.value,
    };

    const nextUrl = 'parcel-orders';
    parcelOrderService
      .create(payload)
      .then((res) => {
        batch(() => {
          dispatch(fetchParcelOrders({}));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        });
        toast.success(t('successfully.created'));
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  const onFinishFailed = (event) => {
    const steps = ['', '', ''];
    const fields = event.errorFields.map((item) => item.name[0]);
    fields.forEach((el) => {
      if (el.includes('_from')) {
        steps[0] = 'sender.details.invalid';
        return;
      }
      if (el.includes('_to')) {
        steps[1] = 'receiver.details.invalid';
        return;
      }
      steps[2] = 'parcel.details.invalid';
    });
    steps.forEach((item) => {
      if (item) toast.error(t(item));
    });
  };

  return (
    <Card title={t('add.parcel.order')}>
      <Steps current={current} onChange={onChange}>
        {steps.map((item) => (
          <Step title={t(item.title)} key={item.title} />
        ))}
      </Steps>

      <div className='steps-content'>
        <Form
          form={form}
          name='parcel-create'
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            ...activeMenu.data,
          }}
          onFinishFailed={onFinishFailed}
        >
          <div
            className={
              steps[current].content === 'First-content' ? '' : 'd-none'
            }
          >
            <ParcelSender
              form={form}
              next={next}
              location={locationFrom}
              setLocation={setLocationFrom}
            />
          </div>
          <div
            className={
              steps[current].content === 'Second-content' ? '' : 'd-none'
            }
          >
            <ParcelReceiver
              form={form}
              next={next}
              prev={prev}
              location={locationTo}
              setLocation={setLocationTo}
            />
          </div>
          <div
            className={
              steps[current].content === 'Third-content' ? '' : 'd-none'
            }
          >
            <ParcelDetails
              form={form}
              loading={loadingBtn}
              prev={prev}
              locationFrom={locationFrom}
              locationTo={locationTo}
              image={image}
              setImage={setImage}
            />
          </div>
        </Form>
      </div>
    </Card>
  );
}
