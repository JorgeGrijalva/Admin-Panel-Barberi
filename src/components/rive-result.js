import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRive } from 'rive-react';
import noproductsfound from '../assets/rive/noproductsfound.riv';
import noresult from '../assets/rive/noresult.riv';
import nosell from '../assets/rive/nosell.riv';

function RiveResult({ id = 'noresult', text = '' }) {
  const { t } = useTranslation();
  const src = {
    noproductsfound: noproductsfound,
    noresult: noresult,
    nosell: nosell,
  };
  const riveParams = {
    src: src[id],
    artboard: 'New Artboard',
    autoplay: true,
  };

  const { RiveComponent } = useRive(riveParams);
  return (
    <div className='animation-canvas'>
      <div style={{ width: '100%', height: 200 }}>
        <RiveComponent />
      </div>
      <div className='text'>{t(text)}</div>
    </div>
  );
}

export default RiveResult;
