import { Card, Steps } from 'antd';
import { SERVICES_FORM_STEPS } from 'constants/services';
import LanguageList from 'components/language-list';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQueryParams } from 'helpers/useQueryParams';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu } from 'redux/slices/menu';
import Details from './steps/details';
import ServiceExtras from './steps/extras';
import { fetchServices } from 'redux/slices/services';
import ServiceFaqs from './steps/faqs';

const ServicesForm = ({ handleSubmitDetails }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const dispatch = useDispatch();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [current, setCurrent] = useState(Number(queryParams.values?.step || 1));
  const next = () => {
    const step = current + 1;
    queryParams.set('step', step);
    setCurrent(step);
  };
  const prev = () => {
    const step = current - 1;
    queryParams.set('step', step);
    setCurrent(step);
  };
  const onChange = async (step) => {
    queryParams.set('step', step + 1);
    setCurrent(step + 1);
  };
  const goToShopsPage = () => {
    const nextUrl = 'services';
    dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
    dispatch(fetchServices({}));
    navigate(`/${nextUrl}`);
  };
  const handleSubmit = {
    details: (body) => {
      return handleSubmitDetails(body).then((res) => {
        if (!!id) {
          next();
        } else {
          navigate(`/services/${res.data?.id}?step=2`);
        }
      });
    },
  };
  return (
    <>
      <Card
        title={t(!!id ? 'edit.service' : 'create.service')}
        extra={<LanguageList />}
      >
        <Steps
          current={current - 1}
          onChange={async (step) => {
            if (!id) {
              return;
            }
            await onChange(step);
          }}
        >
          {SERVICES_FORM_STEPS.map((item) => (
            <Steps.Step title={t(item)} key={item} />
          ))}
        </Steps>
      </Card>

      {SERVICES_FORM_STEPS[current - 1] === 'details' && (
        <Details handleSubmit={handleSubmit.details} />
      )}
      {SERVICES_FORM_STEPS[current - 1] === 'extras' && (
        <ServiceExtras prev={prev} next={next} />
      )}
      {SERVICES_FORM_STEPS[current - 1] === 'faqs' && (
        <ServiceFaqs prev={prev} next={goToShopsPage} />
      )}
    </>
  );
};

export default ServicesForm;
