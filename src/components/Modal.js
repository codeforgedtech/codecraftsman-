import React from 'react';
import '../styles/Modal.css'; // Lägg till CSS för modalen i din stilfil

const Modal = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;