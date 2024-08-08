import React from 'react';
import {Checkbox, Form} from "antd";

const CheckboxCustom = ({activeCheckbox, changeActiveValue, disabled, active, label, name}) => {
    return (
            <Form.Item
                label={label}
                name={name}
                tooltip={"uncheck_if_category_is_inactive"}
            >
                <Checkbox
                    checked={activeCheckbox}
                    onChange={changeActiveValue}>
                    {activeCheckbox ? active : disabled}
                </Checkbox>
            </Form.Item>
    );
};

export default CheckboxCustom;