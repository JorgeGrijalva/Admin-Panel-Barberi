import React, { useEffect } from 'react';
import { Radio } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setDefaultLanguage, setLangugages } from 'redux/slices/formLang';
import languagesService from 'services/languages';

const LanguageList = () => {
  const dispatch = useDispatch();
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  const fetchLanguages = () => {
    languagesService.getAllActive().then(({ data }) => {
      batch(() => {
        dispatch(setLangugages(data));
        dispatch(
          setDefaultLanguage(
            data?.find((item) => Boolean(item?.default))?.locale,
          ),
        );
      });
    });
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const onChangeLanguage = ({ target: { value } }) => {
    dispatch(setDefaultLanguage(value));
  };

  return (
    <>
      <Radio.Group
        value={defaultLang}
        onChange={onChangeLanguage}
        className='float-right'
        buttonStyle='solid'
      >
        {languages?.map((item) => {
          return (
            <Radio.Button value={item.locale} key={item.id}>
              {item.title}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </>
  );
};

export default LanguageList;
