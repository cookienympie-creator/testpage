// components/CustomToastContainer.js
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastStyle={{
        background: 'black',
        color: 'red',
        fontWeight: 'bold',
        border: '1px solid #444',
        borderRadius: '8px',
      }}
      style={{
        zIndex: 9999,
      }}
    />
  );
};

export default CustomToastContainer;
