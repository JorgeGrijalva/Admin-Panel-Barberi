import servicesService from 'services/services';
import ServiceForm from './components/form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const CreateService = () => {
  const { t } = useTranslation();
  const handleSubmit = (values) => {
    return servicesService.create(values).then((res) => {
      toast.success(t('successfully.created'));
      return res;
    });
  };

  return <ServiceForm handleSubmitDetails={handleSubmit} />;
};

export default CreateService;
