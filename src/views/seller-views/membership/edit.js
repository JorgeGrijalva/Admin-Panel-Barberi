import { Form } from 'antd';
import { useEffect, useState } from 'react';
import membershipService from 'services/seller/membership';
import MembershipForm from './form';
import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import Loading from 'components/loading';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';

export default function EditMembership() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [loading, setLoading] = useState(false);
  const fetchMembership = () => {
    setLoading(true);
    membershipService
      .getById(id)
      .then(({ data }) => {
        const body = {
          ...Object.assign(
            {},
            ...data?.translations?.map((item) => ({
              [`title[${item?.locale}]`]: item?.title,
            })),
          ),
          ...Object.assign(
            {},
            ...data?.translations?.map((item) => ({
              [`description[${item?.locale}]`]: item?.description,
            })),
          ),
          ...Object.assign(
            {},
            ...data?.translations?.map((item) => ({
              [`term[${item?.locale}]`]: item?.term,
            })),
          ),
          shop: {
            label: data?.shop?.translation?.title,
            value: data?.shop?.id,
            key: data?.shop?.id,
          },
          services: data?.services?.map((service) => ({
            label: service?.service?.translation?.title,
            value: service?.service?.id,
            key: service?.service?.id,
          })),
          price: data?.price,
          color: data?.color,
          sessions:
            data?.sessions === 2
              ? { label: 'unlimited', value: 2, key: 2 }
              : {
                  label: 'limited',
                  value: 1,
                  key: 1,
                },
          sessions_count: data?.sessions_count,
          time: data?.time,
        };
        form.setFieldsValue(body);
        dispatch(setMenuData({ activeMenu, data: body }));
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (body) => {
    return membershipService.update(id, body);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchMembership();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <MembershipForm form={form} handleSubmit={handleSubmit} />
      )}
    </Fragment>
  );
}
