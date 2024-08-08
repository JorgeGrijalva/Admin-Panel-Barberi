import React, { useState } from 'react';
import exportService from '../../services/export';
import download from 'downloadjs';
import Loading from '../../components/loading';
import { Button, Card, Col, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { BsClipboardCheck } from 'react-icons/bs';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
const Meta = Card.Meta;

const DownloadModal = ({ id, handleCancel }) => {
  const [downloading, setDownloading] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  function getInvoiceFile(id) {
    setDownloading(true);
    exportService
      .orderExport(id)
      .then((res) => {
        download(res, `invoice_${id}.pdf`, 'application/pdf');
        handleCancel();
      })
      .finally(() => setDownloading(false));
  }

  const generateInvoice = (id) => {
    navigate(`/orders/generate-invoice/${id}`);
  };

  return (
    <>
      {downloading ? (
        <Loading />
      ) : (
        <Modal
          visible={!!id}
          title={t('selected.download')}
          closable={false}
          handleCancel={handleCancel}
          footer={[
            <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
              {t('cancel')}
            </Button>,
          ]}
        >
          <Row>
            <Col span={12}>
              <Card
                title={t('download.pdf')}
                onClick={() => getInvoiceFile(id)}
                className='text-center cursor-pointer'
              >
                <Meta
                  className='d-flex align-items-center justify-content-center'
                  title={<BsClipboardCheck size={80} />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={t('download.check')}
                onClick={() => generateInvoice(id)}
                className='text-center cursor-pointer'
              >
                <Meta
                  className='d-flex align-items-center justify-content-center'
                  title={<AiOutlineFilePdf size={85} />}
                />
              </Card>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};

export default DownloadModal;
