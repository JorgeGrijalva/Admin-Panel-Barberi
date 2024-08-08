import React, {useState} from 'react'
import axios from "axios"
import {Form, Modal, Spin, Upload} from "antd";
import {uploadButton} from "./upload-button";
import {api_url_admin_dashboard} from "../configs/app-global";
import {GALLERIES_URL} from "../configs/urls";
import {toast} from "react-toastify";

const UploadImage = ({name, type, label, fileListBack, setFileListBack}) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [loading, setLoading] = useState(false)
    // modal preview
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // modal cansel
    const handleCancel = () => setPreviewVisible(false);


    //modal upload file
    const getBase644 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase644(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };


    const handleChange = async ({fileList: data}) => {

        let formData = new FormData();
        formData.append('image', data[0]?.originFileObj);
        formData.append('type', type);
        if (data.length === 1) {
            setLoading(true)
            axios.post(api_url_admin_dashboard + GALLERIES_URL,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            ).then((res) => {
                setFileListBack([...fileListBack, res.data.data.title])
            }).catch((err) => {
                toast.error("error", err)
            }).finally(() => {
                setLoading(false)
            })
        } else {
            setFileListBack(data);
            toast.success("delete successfully")
        }
    }

    return (
        <Form.Item
            label={label}
            tooltip="upload logo"
        >
            <Form.Item
                name={name}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                    {
                        required: true,
                        message: "missing logo image"
                    },
                ]}
                noStyle>

                {
                    !loading ? (
                        <Upload
                            listType="picture-card"
                            className="uloaded-test"
                            fileList={fileListBack}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={() => {
                                return false
                            }}
                        >
                            {fileListBack.length >= 1 ? "" : uploadButton}
                        </Upload>
                    ) : <div className="card d-flex justify-content-center align-items-center"
                             style={{width: "102px", height: "102px"}}><Spin/></div>
                }

            </Form.Item>
            <Modal visible={previewVisible}
                   title={previewTitle}
                   footer={null}
                   onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </Form.Item>
    )
}

export default UploadImage