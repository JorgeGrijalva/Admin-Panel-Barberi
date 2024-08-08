import React from 'react';
import servicesService from 'services/seller/services';
import { useParams } from 'react-router-dom';

import ServiceForm from './components/form';

const EditService = () => {
  const { id } = useParams();

  const onFinish = (values) => {
    return servicesService.update(id, values);
  };

  return <ServiceForm handleSubmitDetails={onFinish} />;
};

export default EditService;
