import React from 'react';

import '../assets/scss/components/qr-code-card.scss';

export function QrCodeCard({ title, checked, imgPath }) {
  return (
    <div
      className={checked ? 'qr-radio-card qr-radio-checked' : 'qr-radio-card'}
    >
      <div className='header'>{title}</div>
      <img src={imgPath} alt='regular focus'></img>
    </div>
  );
}
