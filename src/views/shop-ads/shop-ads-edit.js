import React from 'react';
import { useParams } from 'react-router-dom';
import ShopAdsForm from './shop-ads-form';

const ShopAdsEdit = () => {
  const { id } = useParams();

  return <ShopAdsForm id={id} />;
};

export default ShopAdsEdit;
