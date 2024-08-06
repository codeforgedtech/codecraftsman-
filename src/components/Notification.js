import React from 'react';
import '../styles/Notification.css'; // Import styling for the notification

const Notification = ({ message, type }) => {
  return (
    message ? (
      <div className={`notification ${type}`}>
        {message}
      </div>
    ) : null
  );
};

export default Notification;