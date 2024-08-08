import React from 'react';
import {ToastContainer} from "react-toastify";

const ToastReact = ({delay}) => {
    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={delay}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ToastReact;