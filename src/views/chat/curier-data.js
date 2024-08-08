import React from 'react';
import images from '../../assets/images/1.png';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Image } from 'antd';

function CurierData() {
  return (
    <div className='curier-data'>
      <div className='avatar'>
        <Image src={images} />
      </div>
      <div className='content'>
        <div className='name'>Jonh Antoniome</div>
        <div className='position'>
          <span>Driver</span>
          <AiFillCheckCircle size={4} color='#45A524' />
          <span className='online'>online</span>
        </div>
      </div>
    </div>
  );
}

export default CurierData;
