// src/components/Modal.jsx
import React from 'react';
import '../styles/components/Modal.css';

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Да</button>
          <button onClick={onCancel}>Нет</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;