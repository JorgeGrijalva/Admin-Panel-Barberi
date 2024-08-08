import React from 'react';
import {Button, Form} from "antd";

const SendButtons = ({text, type , click}) => {
    return (
        <Form.Item>
            <Button
                type={type ? type : 'primary'}
                className="btn-success btn-outline-primary"
                htmlType="submit"
                onClick={click}
            >
                {text ? text : 'save'}
            </Button>
        </Form.Item>
    );
};

export default SendButtons;