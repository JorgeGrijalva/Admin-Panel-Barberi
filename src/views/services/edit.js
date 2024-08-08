import servicesService from 'services/services';
import { useParams } from 'react-router-dom';
import ServiceForm from './components/form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EditService = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const handleSubmit = (values) => {
    return servicesService.update(id, values).then((res) => {
      toast.success(t('successfully.updated'));
      return res;
    });
  };

  return <ServiceForm handleSubmitDetails={handleSubmit} />;
};

export default EditService;
