import React, { useEffect, useState } from 'react';
import ParcelOptionForm from './option-form';
import { useNavigate, useParams } from 'react-router-dom';
import parcelOptionService from 'services/parcel-option';
import Loading from 'components/loading';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import getTranslationFields from 'helpers/getTranslationFields';
import { useDispatch } from 'react-redux';
import { removeFromMenu } from 'redux/slices/menu';

export default function OptionEdit() {
  const { id } = useParams();
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const { t } = useTranslation();
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [data, setData] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getOption = async () => {
    setIsFetching(true);
    parcelOptionService
      .getById(id)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const handleUpdate = (values) => {
    setUpdating(true);
    parcelOptionService
      .update(id, { title: getTranslationFields(languages, values, 'title') })
      .then(() => {
        navigate('/options');
        toast.success(t('succesfully.updated'));
        const nextUrl = 'options'
        dispatch(removeFromMenu({...activeMenu, nextUrl}));
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  useEffect(() => {
    getOption();
  }, []);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <ParcelOptionForm
      data={data}
      onFinish={handleUpdate}
      isSubmitting={isUpdating}
    />
  );
}
