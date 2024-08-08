import React from 'react';
import { useParams } from 'react-router-dom';
import AdvertForm from './advert-form';

const AdvertEdit = () => {
  const { id } = useParams();

  return <AdvertForm id={id} />;
};

export default AdvertEdit;
