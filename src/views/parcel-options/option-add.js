import React, { useState } from 'react';
import ParcelOptionForm from './option-form';
import parcelOptionService from 'services/parcel-option';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import getTranslationFields from 'helpers/getTranslationFields';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromMenu } from 'redux/slices/menu';

export default function ParcelOptionAdd() {
  const [loading, setLoading] = useState(false);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleCreateOption = (values) => {
    setLoading(true);
    parcelOptionService
      .create({ title: getTranslationFields(languages, values, 'title') })
      .then(() => {
        navigate('/options');
        toast.success(t('created.succesfully'));
        const nextUrl = 'options'
        dispatch(removeFromMenu({...activeMenu, nextUrl}));
      })
      .finally(() => setLoading(false));
  };
  return (
    <ParcelOptionForm onFinish={handleCreateOption} isSubmitting={loading} />
  );
}
