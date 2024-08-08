import React from 'react';
import ServiceForm from './components/form';
import servicesService from 'services/seller/services';

const CreateService = () => {
  const onFinish = (values) => {
    return servicesService.create(values);
  };

  return <ServiceForm handleSubmitDetails={onFinish} />;
};

export default CreateService;
